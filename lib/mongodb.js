import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("MONGODB_URI not defined");

let cached = global.mongooseConn || { conn: null, promise: null };
global.mongooseConn = cached;

const options = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI, options);

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected ✅");
  } catch (err) {
    cached.promise = null;
    console.error("MongoDB connection failed ❌", err);
    throw err;
  }

  return cached.conn;
}
