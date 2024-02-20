import * as couchbase from "couchbase"

import { getDatabase } from "@/lib/couchbase-connection"

/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET(_request: Request) {
  // const {airlineCollection} = await getDatabase();

  //   const cluster = await couchbase.connect(process.env.DB_CONN_STR!, {
  //     username: process.env.DB_USERNAME!,
  //     password: process.env.DB_PASSWORD!,
  //     configProfile: 'wanDevelopment',
  // })
  // console.log("cluster" , cluster)

  // Do whatever you want
  return new Response("Hello World!", {
    status: 200,
  })
}
