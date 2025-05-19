import express from "express"
import { check, getAllUser, login, logout, register } from "../controllers/auth.controller.js"
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js"

const authRoutes = express.Router()


authRoutes.post("/register", register)
authRoutes.post("/login", login)
authRoutes.post("/logout", authMiddleware, logout)
authRoutes.get("/check", authMiddleware, check)
authRoutes.get("/get-all-users", authMiddleware, isAdmin, getAllUser)

export default authRoutes