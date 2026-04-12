import { catchAsyncErrors } from "./catchAsynError.js";
import ErrorHandler from "./error.js";
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
//browser ke token ko dekhenge ki Db se match ho rha hai ki nhi 
//phle req.cookie se token ko lenge 
// phe usko decode krenhe 
// req.user 
export const isAuthenticated= catchAsyncErrors( async (req,resp,next)=>{
    const {token}= req.cookies;
    if(!token){
        return next(new ErrorHandler("Not Authenticated",404));
    }
    // here we access the token for frontend user id 
    const decode=jwt.verify(token,process.env.JWT_SICRET_KEY)//

    req.user= await User.findById(decode.id);
    next();


})
    
