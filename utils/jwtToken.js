
export const sendToken= (user,statusCode,reps,message)=>{
    const token=user.getJWTToken(); // is function ko models me create kiya hu
    const options={
        expires: new Date(
            Date.now() +process.env.COOKIE_EXPIRE *24 * 60 * 60 * 1000
        ),
        httpOnly:true,
    }
   reps.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        message,
        
        token
    })
}