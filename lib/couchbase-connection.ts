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

let cachedDbConnection: DbConnection | null = null

declare const global: {
  couchbase?: {
    conn: couchbase.Cluster | null
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: { conn: couchbase.Cluster | null } = global.couchbase ?? {
  conn: null,
}

async function createCouchbaseCluster(): Promise<couchbase.Cluster> {
  if (cached.conn) {
    return cached.conn
  }
  const cluster = await couchbase.connect(DB_CONN_STR, {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    configProfile: "wanDevelopment",
  })

  cached.conn = cluster
  return cluster
}

async function connectToDatabase(): Promise<DbConnection> {
  const cluster = await createCouchbaseCluster()
  const bucket = cluster.bucket(DB_BUCKET_NAME)
  const scope = bucket.scope("inventory")
  const airlineCollection = scope.collection("airline")
  const airportCollection = scope.collection("airport")
  const routeCollection = scope.collection("route")
  const hotelCollection = scope.collection("hotel")

  const dbConnection: DbConnection = {
    cluster,
    bucket,
    scope,
    airlineCollection,
    airportCollection,
    routeCollection,
    hotelCollection,
  }
  cachedDbConnection = dbConnection
  return dbConnection
}

export function getDatabase(): Promise<DbConnection> {
  if (!cachedDbConnection) {
    // If connection doesn't exist, create and cache it
    return connectToDatabase()
  }
  // If connection exists, return it
  return Promise.resolve(cachedDbConnection)
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