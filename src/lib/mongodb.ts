import { MongoClient, type Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const rawUri = process.env.MONGODB_URI;
const dbName = (process.env.DB_NAME || "fixmate").trim();

if (!rawUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

const uri = rawUri.trim();

type MongoGlobalState = {
    client: MongoClient | null;
    closed: boolean;
};

const globalForMongo = globalThis as unknown as {
    _fixmateMongoState?: MongoGlobalState;
};

const mongoState: MongoGlobalState =
    globalForMongo._fixmateMongoState ?? {
        client: null,
        closed: false,
    };

globalForMongo._fixmateMongoState = mongoState;

function isClientClosed(client: MongoClient): boolean {
    const internal = client as unknown as {
        topology?: { isClosed?: () => boolean };
    };
    return Boolean(internal.topology?.isClosed?.());
}

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

    const markClosed = () => {
        if (mongoState.client === client) {
            mongoState.closed = true;
            mongoState.client = null;
        }
    };

    client.once("topologyClosed", markClosed);
    client.once("close", markClosed);

    attachDatabasePool(client);
    return client;
}

export function getMongoClient(): MongoClient {
    if (
        !mongoState.client ||
        mongoState.closed ||
        isClientClosed(mongoState.client)
    ) {
        mongoState.client = createMongoClient();
        mongoState.closed = false;
    }

    return mongoState.client;
}

export function getMongoDb(): Db {
    return getMongoClient().db(dbName);
}

// Self-healing proxies: if Fluid Compute or a transient error closes the topology,
// the next BetterAuth query automatically reconnects with a fresh MongoClient.
export const mongoClient: MongoClient = new Proxy({} as MongoClient, {
    get(_target, prop) {
        const activeClient = getMongoClient();
        const value = Reflect.get(activeClient, prop, activeClient);
        return typeof value === "function" ? value.bind(activeClient) : value;
    },
});

export const db: Db = new Proxy({} as Db, {
    get(_target, prop) {
        const activeDb = getMongoDb();
        const value = Reflect.get(activeDb, prop, activeDb);
        return typeof value === "function" ? value.bind(activeDb) : value;
    },
});