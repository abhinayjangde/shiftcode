import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import problemRoutes from "./routes/problem.route.js"
import executeRoutes from "./routes/executeCode.route.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

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

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})