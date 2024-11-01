import express from "express";
import {
  getParticipants,
  createParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from "../services/participantService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/roleMiddleware.js";
import { body } from "express-validator";
import { PARTICIPANTS_ROLE } from "../constants.js";
import { handleValidationErrors } from "../middleware/validationErrorMiddleware.js";

const router = express.Router();

const validateParticipantData = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
  body("age").isInt({ min: 0 }).withMessage("Age must be a positive integer"),
  body("role").isIn(PARTICIPANTS_ROLE).withMessage("Invalid role"),
];

router.get("/", getParticipants);
router.get("/:id", getParticipantById);
router.post(
  "/",
  authMiddleware,
  validateParticipantData,
  handleValidationErrors,
  checkPermission("create"),
  createParticipant
);
router.put(
  "/:id",
  authMiddleware,
  validateParticipantData,
  handleValidationErrors,
  checkPermission("update"),
  updateParticipant
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("delete"),
  deleteParticipant
);

export default router;
