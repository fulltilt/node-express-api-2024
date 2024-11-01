import mongoose, { connections } from "mongoose";

const connect = async (dbName) => {
  try {
    let connectionString = process.env.MONGO_URI || "";
    if (connectionString === "") throw new error("No connection string found");
    connectionString = connectionString.replace("{1}", dbName);
    await mongoose.connect(connectionString);
    console.log("Successfully connected to DB");
  } catch (error) {
    console.log("Could not connect to the DB", error?.message);
    process.exit();
  }
};

export default connect;
