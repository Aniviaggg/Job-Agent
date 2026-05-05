import mongoose from 'mongoose';
import { config } from './index';

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri);
    console.log(`✓ MongoDB connected to ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error);
    process.exit(1);
  }
};
