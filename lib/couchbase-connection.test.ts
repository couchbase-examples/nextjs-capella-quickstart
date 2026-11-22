import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { connect } = vi.hoisted(() => ({ connect: vi.fn() }))

vi.mock("couchbase", () => ({
  connect,
  IndexExistsError: class IndexExistsError extends Error {},
}))

function fakeCluster() {
  const scope = { collection: (name: string) => ({ name }) }
  return {
    bucket: () => ({ scope: () => scope }),
    searchIndexes: () => ({
      getAllIndexes: async () => [{ name: "hotel_search" }],
      upsertIndex: async () => undefined,
    }),
  }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

// Importing the module also kicks off insertFTSIndexes(), which calls
// getDatabase(); the tests below account for that shared first call.
async function loadModule() {
  return import("./couchbase-connection")
}

describe("getDatabase", () => {
  beforeEach(() => {
    vi.resetModules()
    connect.mockReset()
    delete (globalThis as { couchbaseConnection?: unknown }).couchbaseConnection
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("opens a single cluster connection for concurrent callers", async () => {
    const pending = deferred<ReturnType<typeof fakeCluster>>()
    connect.mockReturnValue(pending.promise)
    const { getDatabase } = await loadModule()

    const calls = [getDatabase(), getDatabase(), getDatabase()]
    pending.resolve(fakeCluster())
    const connections = await Promise.all(calls)

    expect(connect).toHaveBeenCalledTimes(1)
    expect(connections[1]).toBe(connections[0])
    expect(connections[2]).toBe(connections[0])
  })

  it("reuses the connection when the module is re-evaluated (hot reload)", async () => {
    connect.mockImplementation(async () => fakeCluster())
    const first = await (await loadModule()).getDatabase()

    vi.resetModules()
    const second = await (await loadModule()).getDatabase()

    expect(connect).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)
  })

  it("retries after a failed connection attempt", async () => {
    const failing = deferred<ReturnType<typeof fakeCluster>>()
    connect
      .mockReturnValueOnce(failing.promise)
      .mockImplementation(async () => fakeCluster())
    const { getDatabase } = await loadModule()

    const firstAttempt = getDatabase()
    failing.reject(new Error("cluster unavailable"))
    await expect(firstAttempt).rejects.toThrow("cluster unavailable")

    const connection = await getDatabase()

    expect(connect).toHaveBeenCalledTimes(2)
    expect(connection.airlineCollection).toEqual({ name: "airline" })
  })
})
