import { connect } from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

const connectToDB = async () => {
  try {
    const { connection } = await connect(MONGO_URI, {
      dbName: "QuickShare",
    });
    console.log(`Mongo connected: ${connection.host}`);
  } catch (error) {
    console.log(`Mongo Error: ${error}`);
  }
};

export default connectToDB;
