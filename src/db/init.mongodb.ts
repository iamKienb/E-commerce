import mongoose, { ConnectOptions } from "mongoose";
import config from '../config';


export default function connectDB() {
  const url = config.db.dbHost
 
  try {
    mongoose.connect(url);
  } catch (err:any) {
    console.error(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected`);
  });
 
  dbConnection.on("error", (err) => {
    console.error(`connection error`);
  });
  return;
}