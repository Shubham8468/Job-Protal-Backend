import mongoose from "mongoose"

const jobSchema= new mongoose.Schema({
    title:{
        type:String,
        required:[true,"please Enter Job Title."],

    },
    jobType:{
        type:String,
        required:[true,"Please Enter JobType."],
        enum:["Full-Time","Part-Time","Internship"]
    },
    location:{
       type:String,
       required:[true,"Please Provied Job Location."]
    },
    companyName:{
        type:String,
        required:[true,"Please Enter Compony Name."],

    },
    introduction:{
        type:String
    },
    responsibilities:{
        type:String,
        required:[true,"Please Provied Job Responsibilites."]
    },
    qualification:{
        type:String,
        required:true
    },
    offers:{
        type:String,
    },
    salary:{
        type:Number,
        required:[true,"Please Enter Salary."]
    },
    hiringMulipleCandidates:{
        type:String,
        default:"No",
        enum:["Yes","No"]
    },
    personalWebsite:{
       title:String,
       url:String
    },
    jobNiche:{
        type:String,
        required:[true,"Please Enter Job Niches."]
    },
    // this are the part of automation  
    newsLettersSent:{
        type:Boolean,
        default:false
    },
    jobPostedOn:{
        type:Date,
        default:Date.now(),
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",// Fectch from the User Schema
        required:true
    }


})


export const Job= mongoose.model("Job",jobSchema);

