import { randomUUID } from "crypto"

/**
 * Returns a document ID that is unique to this test run.
 *
 * The CI cluster is shared with other quickstarts and with concurrent runs of
 * this suite, so a fixed ID such as "route_post" can already exist (or be
 * removed) by someone else mid-run. Tests that write documents must use IDs
 * nobody else can collide with.
 */
export const uniqueTestId = (prefix: string) => `${prefix}_${randomUUID()}`
