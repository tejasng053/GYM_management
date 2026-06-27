import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async (): Promise<void> => {
  let uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined. Falling back to an in-memory MongoDB server for testing...');
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (In-Memory: ${!process.env.MONGODB_URI})`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;