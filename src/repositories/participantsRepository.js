import mongoose from "mongoose";
import Participants from "./schemas/participantsSchema.js";
import { logMsg } from "../lib/logProducer.js";

export const getAllParticipants = async () => {
  const result = await Participants.find();
  if (!result) return [];
  return result;
};

export const getSingleParticipantById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Object Id");
    return null;
  }

  const participant = await Participants.findById(id);
  if (!participant) return null;
  return participant;
};

export const createParticipantByName = async (name, age, role, logId) => {
  logMsg(logId, "creating participant in the repository", { name, age, role });
  const newParticipant = new Participants({ name, age, role });
  const result = await newParticipant.save();
  logMsg(logId, "successfully created participant", result);
  return result;
};

export const updateParticipantById = async (id, name, age, role) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Object Id");
    return null;
  }

  const result = await Participants.findByIdAndUpdate(
    id,
    {
      name,
      age,
      role,
    },
    { new: true }
  );
  if (!result) return null;
  return result;
};

export const deleteParticipantById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Object Id");
    return false;
  }

  const result = await Participants.findOneAndDelete(id);
  // console.log("deleteParticipantById", result);
  if (!result) return false;
  return true;
};
