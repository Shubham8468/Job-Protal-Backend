import { catchAsyncErrors } from "../middleware/catchAsynError.js"
import ErrorHandler from "../middleware/error.js"
import { User } from "../models/user.model.js"
import {v2 as cloudinary} from "cloudinary"
import {sendToken} from "../utils/jwtToken.js"


export const userRegisted = catchAsyncErrors(async (req, resp, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        address,
        firstNiche,
        secoundNiche,
        thirdNiche,
        password,
        skills,
        coverLetter,
        role
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !address || !password || !role) {
        return next(new ErrorHandler("All fields are required.", 400));
    }
    // if user is job siker than it give this fields
    if (role === "job Seeker" && (!firstNiche || !secoundNiche || !thirdNiche)) {
        return next(new ErrorHandler("Please Provide your Niches .!", 400))
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already registered!", 400));
    }
    const userData= {
        firstName,
        lastName,
        email,
        phone,
        address,
        password,
        role,
        skills,
        niches:{
            firstNiche,
            secoundNiche,
            thirdNiche
        },
        coverLetter
    }
    

    // Now i get the resume 
    if(req.files && req.files.resume){
        const {resume}=req.files;
        if(resume){
            try{
                const cloudinaryResponse=await cloudinary.uploader.upload(resume.tempFilePath,{
                   folder:`${firstName}_Resume` // i will give name of folder. In this folder store our resume 
                })
                if(!cloudinaryResponse || cloudinaryResponse.error){
                    return next( new ErrorHandler("Failed To upload resume to cloud",500));
                }
                // ager cloud pe store ho gya to hm user object me resume ks public url add kr denge
                userData.resume={
                    public_id:cloudinaryResponse.public_id,
                    url:cloudinaryResponse.secure_url
                }
            }catch(error){
                return next(new ErrorHandler("Failed to upload Resume",500))
            }
        }
    }
     user= await User.create(userData);
    return sendToken(user,200,resp,"User register Successfully!");
})

