import mongoose from "mongoose";

import { ENV } from "./env.js";

let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (!ENV.DB_URL) {
    throw new Error("DB_URL is not defined in environment variables");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(ENV.DB_URL, { bufferCommands: false })
      .then((m) => {
        console.log("✅ Connected to MongoDB:", m.connection.host);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("❌ Error connecting to MongoDB", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
