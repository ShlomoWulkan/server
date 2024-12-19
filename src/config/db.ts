import mongoose from 'mongoose';
import { seedDatabase } from './sid';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    await seedDatabase();
    console.log(`Mongo Connected: ${process.env.MONGO_URI}`);
  } catch (error) {
    console.log(`${error}`);
  }
};

export default connectDB;