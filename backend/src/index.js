import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import problemRoutes from "./routes/problem.route.js"
import executeRoutes from "./routes/executeCode.route.js"
import submissionRoutes from "./routes/submission.route.js"
import playlistRoutes from "./routes/playlist.route.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8000


app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.get("/",(req,res)=>{
    return res.status(200).send("welcome to codeside!")
})

// Auth Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code", executeRoutes)
app.use("/api/v1/submission", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes)

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})