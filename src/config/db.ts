import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined. Server will run without database — API routes will return errors.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout instead of 30s default
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.warn('⚠️ Server will continue running without database. API routes may fail.');
  }
};

export default connectDB;