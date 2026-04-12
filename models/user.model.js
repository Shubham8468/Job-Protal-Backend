import mongoose from "mongoose";
import validator from "validator"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        
        required:[true,"Please Enter your first Name."],
        minlength:[3,"Name must be at least 3 characters"],
        maxlength:[30,"Name cannot exceed 30 characters"]
    },
    lastName:{
        type:String,
        required:[true,"Please Enter your Last Name."],
        minlength:[3,"Last name must be at least 3 characters"],
        maxlength:[30,"Last name cannot exceed 30 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your email."],
        unique:true,
        validate:[validator.isEmail,"Plase Enter a valid email."]
    },
    phone:{
        type:String,
        required:[true,"Please Enter 10 Digite Number."],
        validate:{
            validator:function(v){
                return /^[6-9]\d{9}$/.test(v);
            },
            message:"Please Enter a valid 10 digit Indian phone number"
        },
    }
    ,
    address:{
        type:String,
        required:[true,"Please Enter Full Address"],
        minlength:[10,"Address must be at least 10 characters"],
        maxlength:[50,"Address cannot exceed 50 characters"]
    },
    niches:{
        firstNiche:String,// like mu niche is frontend 
        secoundNiche:String,// is backend 
        thirdNiche:String // flutter
    },
    password:{
        type:String,
        required:[true,"Plase Enter your Password"],
        minlength:[8,"password must contain at last 8 characters!"],
        maxlength:[30,"Password can not exceed 32 characters"],
        select:false
    },
    skills:{
          type:String
    },
    resume:{
        public_id:String,
        url:String
    },
    coverLetter:{
        type:String,
    },
    role:{
        type:String,
        required:true,
        enum:["job Seeker","Employer"]
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

 userSchema.methods.getJWTToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SICRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,

    })
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})
// here i check user Enter Password is correct or not by compare DB password During Login Time
// Bt useing bcryt.compare
userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}



export const User= mongoose.model("User",userSchema);



