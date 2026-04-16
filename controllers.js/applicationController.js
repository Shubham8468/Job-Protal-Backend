import { catchAsyncErrors } from "../middleware/catchAsynError.js"
import ErrorHandler from "../middleware/error.js"
import { Application } from "../models/application.model.js"
import { Job } from "../models/job.model.js"
import { v2 as cloudinary } from "cloudinary"



export const postApplication = catchAsyncErrors(async (req, resp, next) => {
    const { id } = req.params; // this is the Job Id come from frontend
    const { name, email, phone, address, coverLetter } = req.body;
    if (!name || !email || !phone || !address || !coverLetter) {
        return next(new ErrorHandler("Please Provied all Fiedls.", 400));
    }


    const jobSeekerInfo = {
        id: req.user._id,
        name,
        email,
        phone,
        address,
        coverLetter,
        role: "job Seeker"
    }

    // we find the posted job with the help of{ id , createdBy}that are get my req.params
    const jobDetails = await Job.findById(id);
    if (!jobDetails) {
        return next(new ErrorHandler("Job Not Found", 404));
    }

    //    // here i will check this user is allready Applied this job or not
    const allredyApplied = await Application.findOne({
        "jobSeekerInfo.id": req.user._id,
        "jobInfo.id": id
    })
    if (allredyApplied) {

        return next(new ErrorHandler("You Have Allready Applied this Job.", 404))
    }
    if (req.files && req.files.resume) {
        const { resume } = req.files;
        try {
            const upload = await cloudinary.uploader.upload(resume.tempFilePath, {
                folder: `${name}_Resume`,
                resource_type: "raw"
            });
            if (!upload || upload.error) {
                return next(new ErrorHandler("Failed to upload your Resume", 400));
            };
            jobSeekerInfo.resume = {
                public_id: upload.public_id,
                url: upload.secure_url
            }

        } catch (error) {
            return next(new ErrorHandler(error.message || "failed to upload Resume", 500))

        }
    }
    else {
        if (req.user && !req.user.resume.url) {
            return next(new ErrorHandler("please Upload Your Resume.", 400));
        }
        jobSeekerInfo.resume = {
            public_id: req.user.resume.public_id,
            url: req.user.resume.url
        }
    }

    const employerInfo = {
        id: jobDetails.postedBy,
        role: "Employer"
    }
    const jobInfo = {
        jobId: id,
        jobTitle: jobDetails.title
    }

    const application = await Application.create({ jobSeekerInfo, employerInfo, jobInfo })
    if (!application) {
        return next(new ErrorHandler("Not Applied.", 404));
    }
    return resp.status(200).json({
        success: true,
        message: "Application Submitted successfully.",
        application
    })





})

export const employerGetAllApllication = catchAsyncErrors(async (req, resp, next) => {
    const { _id } = req.user;
    const application = await Application.find({
        "employerInfo.id": _id,
        "deletedBy.employer": false
    })
    return resp.status(200).json({
        success: true,
        count: application.length,
        application
    })

})
export const jobSeekerGetAllApplication = catchAsyncErrors(async (req, resp, next) => {
    const { _id } = req.user;
    const application = await Application.find({
        "jobSeekerInfo.id": _id,
        "deletedBy.jobSeeker": false
    })
    if (!application) {
        return next(new ErrorHandler("You are not applied any Job.", 404));
    }
    return resp.status(200).json({
        success: true,
        count: application.length,
        application
    })

})
export const deleteApplication = catchAsyncErrors(async (req, resp, next) => {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
        return next(new ErrorHandler("Application Not Found", 404))
    }
    const { role } = req.user;
    switch (role) {
        case "job Seeker":
            application.deletedBy.jobSeeker = true;
            await application.save()
            break;
        case "Employer":
            application.deletedBy.employer = true;
            await application.save()
            break;
        default:
            console.log("Default case for application Delete ");
            break;

    }
    if(application.deletedBy.employer==true &&application.deletedBy.jobSeeker==true ){
        await application.deleteOne();

    }

    return resp.status(200).json({
        success:true,
        message:"Application Delete Successfully."
    })


})
