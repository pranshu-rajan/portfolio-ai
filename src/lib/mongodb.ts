import { MongoClient } from "mongodb";
import dns from "dns";

// Ensure DNS SRV resolution succeeds on all local/Windows network adapters
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in environments where custom DNS servers cannot be set
}

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClientPromise(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}
