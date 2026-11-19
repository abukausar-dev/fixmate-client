import { MongoClient, ServerApiVersion, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "fixmate";

if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env.local");
}

const globalForMongo = globalThis as unknown as {
    _fixmateMongoClient?: MongoClient;
};

export const mongoClient: MongoClient =
    globalForMongo._fixmateMongoClient ??
    new MongoClient(uri, {
        family: 4,
        serverSelectionTimeoutMS: 30000,
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

if (process.env.NODE_ENV !== "production") {
    globalForMongo._fixmateMongoClient = mongoClient;
}

export const db: Db = mongoClient.db(dbName);