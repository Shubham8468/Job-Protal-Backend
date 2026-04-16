import mongoose from "mongoose";
import validator from "validator"

const applicationSchema = new mongoose.Schema({
    jobSeekerInfo: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            validate: [validator.isEmail, "Please provied a valid Email"]
        },
        phone: {
            type: Number,
            required: [true, "Please Enter 10 Digit Indian Phone Number."],
            validate: {
                validator: function (v) {
                    return /^[6-9]\d{9}$/.test(v);
                },
                message: "Please Enter a valid 10 digit Indian phone number"
            },
        },
        address: {
            type: String,
            required: [true, "Please Provied your Address."]
        },
        resume: {
            public_id: String,
            url: String
        },
        coverLetter: {
            type: String,
            required: [true, "please Provied Your CoverLetter."]
        },
        role: {
            type: String,
            enu: ["job Seeker"],
            required: true
        }

    },
    employerInfo: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["Employer"],
            required: true
        },
        

    },

    jobInfo:{
        jobId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        jobTitle:{
           type:String,
            required:true
        }
    },
    deletedBy:{
        jobSeeker:{
            type:Boolean,
            default:false
        },
        employer:{
            type:Boolean,
            default:false
        }
    }

})

export const Application = mongoose.model("Application", applicationSchema);