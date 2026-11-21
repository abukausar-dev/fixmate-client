import { MongoClient, type Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const rawUri = process.env.MONGODB_URI;
const dbName = (process.env.DB_NAME || "fixmate").trim();

if (!rawUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

const uri = rawUri.trim();

const globalForMongo = globalThis as unknown as {
    _fixmateMongoClient?: MongoClient;
};

function createMongoClient(): MongoClient {
    const client = new MongoClient(uri, {
        family: 4,
        maxPoolSize: 10,
        minPoolSize: 0,
        maxIdleTimeMS: 10000,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
    });

    // Ensures MongoDB pool sockets stay clean across Vercel Fluid Compute suspend/resume cycles
    attachDatabasePool(client);
    return client;
}

export const mongoClient: MongoClient =
    globalForMongo._fixmateMongoClient ?? createMongoClient();

globalForMongo._fixmateMongoClient = mongoClient;

export const db: Db = mongoClient.db(dbName);