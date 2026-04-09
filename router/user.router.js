import express from 'express'
import {userRegisted} from "../controllers.js/userController.js"
const userRouter=express.Router();

userRouter.post("/register",userRegisted);

export default userRouter;