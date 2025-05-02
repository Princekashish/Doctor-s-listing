import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
