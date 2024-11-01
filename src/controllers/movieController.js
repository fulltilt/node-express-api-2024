import express from "express";
import {
  getMovies,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../services/moviesService.js";
import { body } from "express-validator";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { handleValidationErrors } from "../middleware/validationErrorMiddleware.js";
import { MOVIE_GENRE } from "../constants.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

const validateMovieData = [
  body("movieName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("movieDescription")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  body("movieDuration")
    .isInt({ min: 0 })
    .withMessage("Duration must be a positive integer"),
  body("movieRating")
    .isFloat({ min: 0.0, max: 10.0 })
    .withMessage("Rating must be between 0 and 10"),
  body("genre").isIn(MOVIE_GENRE).withMessage("Invalid movie genre"),
];

router.get("/", rateLimiter, getMovies);
router.get("/:id", getMovieById);
router.post(
  "/",
  validateMovieData,
  handleValidationErrors,
  authMiddleware,
  createMovie
);
router.put(
  "/:id",
  validateMovieData,
  handleValidationErrors,
  authMiddleware,
  updateMovie
);
router.delete("/:id", authMiddleware, deleteMovie);

export default router;
