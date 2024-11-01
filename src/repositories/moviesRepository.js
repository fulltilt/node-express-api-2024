import mongoose from "mongoose";
import Movie from "./schemas/moviesSchema.js";

export const getAllMovies = async () => {
  const result = await Movie.find()
    .populate("producer", "-_id -role")
    .populate("director", "_id -role")
    .populate("actors", "_id -role");
  if (!result) return null;
  return result;
};

export const getSingleMovieById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Object Id");
    return null;
  }

  const movie = await Movie.findById(id)
    .populate("producer", "-_id -role")
    .populate("director", "_id -role")
    .populate("actors", "_id -role");
  if (!movie) return null;
  return movie;
};

export const createMovieByName = async (movieObj) => {
  const newMovie = new Movie(movieObj);
  const result = await newMovie.save();
  return result;
};

export const updateMovieById = async (id, movieObj) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Object Id");
    return null;
  }

  const result = await Movie.findByIdAndUpdate(id, movieObj, { new: true });
  if (!result) return null;
  return result;
};

export const deleteMovieById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Object Id");
    return false;
  }

  const result = await Movie.findOneAndDelete(id);
  if (!result) return false;
  return true;
};
