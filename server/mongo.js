import mongoose from "mongoose";

let connectPromise = null;

export async function connectMongo() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (!connectPromise) {
    connectPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 6000,
      })
      .then(() => true)
      .catch((err) => {
        connectPromise = null;
        throw err;
      });
  }

  return connectPromise;
}

export function getMongoStatus() {
  if (!process.env.MONGODB_URI?.trim()) {
    return "not_configured";
  }
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[mongoose.connection.readyState] || "unknown";
}
