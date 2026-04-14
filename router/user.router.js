import express from 'express'
import {userLogin, userLogout, userRegisted,getUser,updateUserProfile,updatePassword} from "../controllers.js/userController.js"
import {isAuthenticated} from "../middleware/auth.js"
const userRouter=express.Router();

userRouter.post("/register",userRegisted);
userRouter.post("/login",userLogin);
userRouter.get("/logout",isAuthenticated,userLogout);
userRouter.get("/me",isAuthenticated,getUser);
userRouter.put("/update/profile",isAuthenticated,updateUserProfile);
userRouter.put("/update/password",isAuthenticated,updatePassword);
export default userRouter;