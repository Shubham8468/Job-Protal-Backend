import express from 'express'
import {userLogin, userLogout, userRegisted} from "../controllers.js/userController.js"
import {isAuthenticated} from "../middleware/auth.js"
const userRouter=express.Router();

userRouter.post("/register",userRegisted);
userRouter.post("/login",userLogin);
userRouter.get("/logout",isAuthenticated,userLogout)
export default userRouter;