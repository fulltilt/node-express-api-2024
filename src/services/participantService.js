import {
  getAllParticipants,
  createParticipantByName,
  getSingleParticipantById,
  updateParticipantById,
  deleteParticipantById,
} from "../repositories/participantsRepository.js";

import {
  getDataFromRedis,
  setDataToRedis,
  invalidKey,
} from "../lib/redisHelper.js";
import { logMsg } from "../lib/logProducer.js";

const REDIS_KEY = "participants";
const REDIS_CACHE = 3600;

export const getParticipants = async (req, res) => {
  const resultFromRedis = await getDataFromRedis(REDIS_KEY);
  if (resultFromRedis) {
    console.log("Found data from Redis", REDIS_KEY);
    res.status(200).json(resultFromRedis);
    return;
  }

  const result = await getAllParticipants();
  console.log("Getting data from database", REDIS_KEY);
  await setDataToRedis(REDIS_KEY, result, REDIS_CACHE);
  res.status(200).json(result);
};

export const getParticipantById = async (req, res) => {
  const id = req?.params?.id ?? "";
  const resultFromRedis = await getDataFromRedis(REDIS_KEY);
  if (resultFromRedis) {
    console.log("Found data from Redis", REDIS_KEY);
    const participant = resultFromRedis?.find((result) => result._id === id);
    res.status(200).json(participant);
    return;
  }

  const result = await getSingleParticipantById(id);
  console.log("Getting data from database", REDIS_KEY);
  if (!result) {
    res.status(404).json({ message: "Participant not found" });
    return;
  }
  res.status(200).json(result);
};

export const createParticipant = async (req, res) => {
  const logId = req.logId;
  const { name, age, role } = req.body;
  logMsg(logId, "creating participant", { name, age, role });
  const result = await createParticipantByName(name, age, role, logId);
  await invalidKey(REDIS_KEY, logId); // invalidate cache else we'll return old data
  res.status(201).json({ result: result, logId: logId });
};

export const updateParticipant = async (req, res) => {
  const id = req?.params?.id ?? "";
  const { name, age, role } = req.body;
  const result = await updateParticipantById(id, name, age, role);
  if (!result) {
    res.status(404).json({ message: "Participant not found" });
    return;
  }
  await invalidKey(REDIS_KEY); // invalidate cache else we'll return old data
  res.status(200).json(result);
};

export const deleteParticipant = async (req, res) => {
  const id = req?.params?.id ?? "";
  const user = req?.user ?? "";

  const result = await deleteParticipantById(id);
  // console.log("deleteParticipant", result);
  if (!result) {
    res.status(404).json({ message: "Participant not found" });
    return;
  }
  await invalidKey(REDIS_KEY); // invalidate cache else we'll return old data
  res.status(204).json();
};
