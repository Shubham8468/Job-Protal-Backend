class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);// get the message from the super Class 
        this.statusCode=statusCode;
    }
}

export const errorMiddleare=(err,req,resp,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Error"
    if(err.name ==="CastError"){
        const message= `Invalid ${err.path}`;
        err= new ErrorHandler(message,500)
    }
    if(err.code ===11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} Enter`
        err=new ErrorHandler(message,400)
    }
    if(err.name === "ValidationError"){
        err.statusCode = 400;
    }
    if(err.name==="JsonWebTokenError"){
        const message= "Json Web Token is invalid, try again."
        err= new ErrorHandler(message,400)
    }
    if(err.name==="TokenExpiredError"){
        const message="Json Web Token is expired, please login again."
        err = new ErrorHandler(message,400)
    }

    const errMessage=err.errors ? Object.values(err.errors).map((error)=>error.message).join(" ,"):err.message
    return resp.status(err.statusCode).json({
         success:false,
         message:errMessage
    })
}

export default ErrorHandler;