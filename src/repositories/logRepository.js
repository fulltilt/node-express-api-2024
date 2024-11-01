import mongoose from "mongoose";
import Log from "./schemas/logSchema.js";
import { logMsg } from "../lib/logProducer.js";

export const createLog = async (logData) => {
  const log = new Log(logData);
  await log.save();
};

export const getLogById = async (id) => {
  const log = await Log.find({ logId: id }).sort({ createdAt: 1 });
  if (!log) return null;
  return log;
};

export const deleteLogs = () => {
  return Log.deleteMany({});
};
