import express from  "express";
import { config } from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors"
import {connectDB} from "./database/connections.js"
import ErrorHandler, { errorMiddleare } from "./middleware/error.js";
import userRouter from "./router/user.router.js";
import fileUpload from "express-fileupload";
import jobRouter from "./router/job.router.js";
import applicationRouter from "./router/application.router.js";
config({ path: "./.env" })

const app= express();
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE",],
    credentials:true

}))

app.use(cookieParser());// for the access cookies 
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// How to get File , that are upload fron the frontend

app.use(
    fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp/",
}))




connectDB();
app.use("/api/v1/user",userRouter);
app.use("/api/v1/job",jobRouter);
app.use("/api/v1/application",applicationRouter)

app.use(errorMiddleare);///  impotent error middlare call alwage in last  



export default app;

