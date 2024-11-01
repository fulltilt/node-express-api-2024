import {
  getAllMovies,
  createMovieByName,
  getSingleMovieById,
  updateMovieById,
  deleteMovieById,
} from "../repositories/moviesRepository.js";

import {
  getDataFromRedis,
  setDataToRedis,
  invalidKey,
} from "../lib/redisHelper.js";

const REDIS_KEY = "movies";
const REDIS_CACHE = 3600;

export const getMovies = async (req, res) => {
  const resultFromRedis = await getDataFromRedis(REDIS_KEY);
  if (resultFromRedis) {
    console.log("Found data from Redis", REDIS_KEY);
    res.status(200).json(resultFromRedis);
    return;
  }

  const result = await getAllMovies();
  console.log("Getting data from database", REDIS_KEY);
  await setDataToRedis(REDIS_KEY, result, REDIS_CACHE);
  res.status(200).json(result);
};

export const getMovieById = async (req, res) => {
  const id = req?.params?.id ?? "";
  const resultFromRedis = await getDataFromRedis(REDIS_KEY);
  if (resultFromRedis) {
    console.log("Found data from Redis", REDIS_KEY);
    const movie = resultFromRedis?.find((result) => result._id === id);
    console.log(movie);
    res.status(200).json(movie);
    return;
  }

  const result = await getSingleMovieById(id);
  console.log("Getting data from database", REDIS_KEY);
  if (!result) {
    res.status(404).json({ message: "Movie not found" });
    return;
  }
  res.status(200).json(result);
};

export const createMovie = async (req, res) => {
  const movieObj = req.body ?? {};
  const result = await createMovieByName(movieObj);
  await invalidKey(REDIS_KEY); // invalidate cache else we'll return old data
  res.status(201).json(result);
};

export const updateMovie = async (req, res) => {
  const id = req?.params?.id ?? "";
  const movieObj = req.body ?? {};
  const result = await updateMovieById(id, movieObj);
  if (!result) {
    res.status(404).json({ message: "Movie not found" });
    return;
  }
  await invalidKey(REDIS_KEY); // invalidate cache else we'll return old data
  res.status(200).json(result);
};

export const deleteMovie = async (req, res) => {
  const id = req?.params?.id ?? "";
  const result = await deleteMovieById(id);
  if (!result) {
    res.status(404).json({ message: "Movie not found" });
    return;
  }
  await invalidKey(REDIS_KEY); // invalidate cache else we'll return old data
  res.status(204).json();
};
