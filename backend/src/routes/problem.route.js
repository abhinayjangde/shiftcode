import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  getSolvedProblems,
  updateProblem,
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authMiddleware, isAdmin, createProblem);

problemRoutes.get("/get-all-problems", getAllProblems);

problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  isAdmin,
  updateProblem
);

problemRoutes.delete("/delete-problem/:id", authMiddleware, deleteProblem);

problemRoutes.get("/get-solved-problems", authMiddleware, getSolvedProblems);

export default problemRoutes;
