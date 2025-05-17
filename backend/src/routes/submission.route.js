import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getAllSubmission, getAllTheSubmissionsForTheProblem, getSubmissionForProblem } from "../controllers/submission.controller.js"

const submissionRoutes = express.Router()

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmission)
submissionRoutes.get("/get-submission/:problemId", authMiddleware, getSubmissionForProblem)
submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, getAllTheSubmissionsForTheProblem)

export default submissionRoutes