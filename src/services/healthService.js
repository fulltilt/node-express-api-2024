import mongoose from "mongoose";
import amqp from "amqplib";
import { DB_NAME } from "../constants.js";
import Redis from "ioredis";

export const checkHealthStatus = async (req, res) => {
  const healthStatus = {
    mongodb: "UNKNOWN",
    redis: "UNKNOWN",
    rabbitmmq: "UNKNOWN",
  };
  let overallHealthStatus = 200;

  try {
    await mongoose.connect(process.env.MONGO_URI.replace("{0}", DB_NAME));
    healthStatus.mongodb = "OK";
  } catch (error) {
    console.log("mongo", error);
    healthStatus.mongodb = "DOWN";
    overallHealthStatus = 503;
  }

  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
    const pingResult = await redisClient.ping();
    console.log(pingResult);
    if (pingResult === "PONG") {
      healthStatus.redis = "OK";
    } else {
      healthStatus.redis = "DOWN";
    }
  } catch (error) {
    console.log("redis", error);
    healthStatus.redis = "DOWN";
    overallHealthStatus = 503;
  }

  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    healthStatus.rabbitmmq = "OK";
    await connection.close();
  } catch (error) {
    console.log("rabbitmq", error);
    healthStatus.rabbitmq = "DOWN";
    overallHealthStatus = 503;
  }

  res.status(overallHealthStatus).json(healthStatus);
};
