import chalk from "chalk";
import * as couchbase from "couchbase"
import fs from "fs";
import path from "path";

const DB_USERNAME: string = process.env.DB_USERNAME ?? "Administrator"
const DB_PASSWORD: string = process.env.DB_PASSWORD ?? "password"
const DB_CONN_STR: string = process.env.DB_CONN_STR ?? "localhost"
const DB_BUCKET_NAME: string = process.env.DB_BUCKET_NAME ?? "travel-sample"

if (!DB_USERNAME) {
  throw new Error(
    "Please define the DB_USERNAME environment variable inside dev.env"
  )
}

if (!DB_PASSWORD) {
  throw new Error(
    "Please define the DB_PASSWORD environment variable inside dev.env"
  )
}

if (!DB_CONN_STR) {
  throw new Error(
    "Please define the DB_CONN_STR environment variable inside dev.env"
  )
}

if (!DB_BUCKET_NAME) {
  throw new Error(
    "Please define the DB_BUCKET_NAME environment variable inside dev.env"
  )
}

interface DbConnection {
  cluster: couchbase.Cluster
  bucket: couchbase.Bucket
  scope: couchbase.Scope
  airlineCollection: couchbase.Collection
  airportCollection: couchbase.Collection
  routeCollection: couchbase.Collection
  hotelCollection: couchbase.Collection
}

/**
 * The connection is memoized as a single promise on `globalThis`, so:
 * - concurrent first requests share one `couchbase.connect` call instead of
 *   each opening their own cluster connection, and
 * - the connection survives module re-evaluation during Next.js hot reloads
 *   in development, preventing connections from growing during API route use.
 * If connecting fails, the memo is cleared so the next call can retry.
 */
const globalForCouchbase = globalThis as typeof globalThis & {
  couchbaseConnection?: Promise<DbConnection>
}

async function connectToDatabase(): Promise<DbConnection> {
  const cluster = await couchbase.connect(DB_CONN_STR, {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    configProfile: "wanDevelopment",
  })
  const bucket = cluster.bucket(DB_BUCKET_NAME)
  const scope = bucket.scope("inventory")

  return {
    cluster,
    bucket,
    scope,
    airlineCollection: scope.collection("airline"),
    airportCollection: scope.collection("airport"),
    routeCollection: scope.collection("route"),
    hotelCollection: scope.collection("hotel"),
  }
}

export function getDatabase(): Promise<DbConnection> {
  if (!globalForCouchbase.couchbaseConnection) {
    globalForCouchbase.couchbaseConnection = connectToDatabase().catch(
      (error) => {
        globalForCouchbase.couchbaseConnection = undefined
        throw error
      }
    )
  }
  return globalForCouchbase.couchbaseConnection
}

export async function insertFTSIndexes() {
  try {
    const { cluster } = await getDatabase();

    const indexesFilePath = path.resolve(process.cwd(), 'hotel_search_index.json');
    let indexesData;
    try {
      indexesData = fs.readFileSync(indexesFilePath, 'utf8');
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT') {
        console.error(chalk.red(`FTS Index File not found: ${indexesFilePath}`));
        return;
      }
      throw fileError;
    }

    let indexes;
    try {
      indexes = JSON.parse(indexesData);
      if (!Array.isArray(indexes)) {
        indexes = [indexes]; // Wrap single object in an array
      }
    } catch (parseError: any) {
      console.error(chalk.red('Error parsing FTS index file:', parseError.message));
      return;
    }

    for (const index of indexes) {
      const existingIndexes = await cluster.searchIndexes().getAllIndexes();
      const indexExists = existingIndexes.some((idx) => idx.name === index.name);

      if (!indexExists) {
        try {
          await cluster.searchIndexes().upsertIndex(index);
          if (process.env.NODE_ENV !== 'test') {
            console.log(chalk.green(`Index ${index.name} created successfully.`));
          }
        } catch (error: any) {
          if (error instanceof couchbase.IndexExistsError) {
            if (process.env.NODE_ENV !== 'test') {
              console.log(chalk.yellow(`Index ${index.name} already exists.`));
            }
          } else {
            console.error(chalk.red('Error creating index:', error.message));
          }
        }
      } else {
        if (process.env.NODE_ENV !== 'test') {
          console.log(chalk.yellow(`Index creation skipped: An index named "${index.name}" already exists.`));
        }
      }
    }
  } catch (error: any) {
    console.error(chalk.red('Error inserting FTS indexes:', error.message));
  }
}

// Call the function to insert FTS indexes
insertFTSIndexes();