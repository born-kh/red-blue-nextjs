import mongoose from 'mongoose';
import { Mongoose } from 'mongoose';

/* eslint-disable no-var */

declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) throw new Error('MONGODB_URI not defined');
if (!MONGODB_DB) throw new Error('MONGODB_DB not defined');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(`${MONGODB_URI}/${MONGODB_DB}`).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
