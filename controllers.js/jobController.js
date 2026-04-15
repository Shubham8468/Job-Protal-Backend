import { catchAsyncErrors } from "../middleware/catchAsynError.js"
import ErrorHandler, { errorMiddleare } from "../middleware/error.js"
import { Job } from "../models/job.model.js"

export const postjob = catchAsyncErrors(async (req, resp, next) => {
    const {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualification,
        offers,
        salary,
        hiringMulipleCandidates,
        personalWebsiteTitle,
        personalWebsiteUrl,
        jobNiche,
        newsLettersSent,
        jobPostedOn,

    } = req.body;
    if (!title ||
        !jobType ||
        !location ||
        !companyName ||
        !introduction ||
        !responsibilities ||
        !qualification ||
        !salary ||
        !jobNiche
    ) {
        return next(new ErrorHandler("please Provied Full Job Deatails.", 404));
    }
    if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
        return next(new ErrorHandler("Provied both the website url and title , or leave both blank.", 404))
    }
    const jobData = {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualification,
        offers,
        salary,
        hiringMulipleCandidates,
        personalWebsite: {
            title: personalWebsiteTitle,
            url: personalWebsiteUrl
        },
        jobNiche,
        newsLettersSent,
        jobPostedOn,

    }
    jobData.postedBy = req.user._id; // here we get id from the token 
    const job = await Job.create(jobData);

    return resp.status(200).json({
        message: "Job Posted Successfully.",
        success: true,
        job
    })
})
 /// Job post By Me 
export const postByMe=catchAsyncErrors(async (req,resp,next)=>{
    const postedBy=req.user._id;
    const totalJob= await Job.find({
        postedBy:postedBy
    });
    if(totalJob.length==0){
        return next(new ErrorHandler("You not posted any Job.",404));
    }
    return resp.status(200).json({
        message:"All Job fetched Successfully that are post by you.",
        success:true,
        count:totalJob.length,
        totalJob
    })
})


// this fuction fatch all posted job from DB
export const getAllJobs = catchAsyncErrors(async (req, resp, next) => {
    const {city,niche,searchKeyword}=req.query;
    const query={};
    if(city){
        query.location=city;
    }
    if(niche){
        query.jobNiche=niche;
    }
    if(searchKeyword){
        query.$or=[
            {title:{$regex:searchKeyword,$options:"i"}}, //option:"i" make the search case-insensitive, so "Node", "node", "NODE" all match
            {companyName:{$regex:searchKeyword,$options:"i"}},
            {introduction:{$regex:searchKeyword,$options:"i"}}
        ]
    }
    const jobs=await Job.find(query);
    if(jobs.length==0){
        return next(new ErrorHandler("No Job Avblaible at this mument.", ))
    }
    return resp.status(200).json({
        success:true,
        count:jobs.length,
        jobs
    })
})

// Fatch only My posted Job

export const getmyjobs = catchAsyncErrors(async (req, resp, next) => {
    const postedBy = req.user._id;
    const myjob = await Job.find({ postedBy })
    if (myjob.length == 0) {
        return next(new ErrorHandler("You not post any Job.", 404));

    }
    const totalJob = myjob.length;
    return resp.status(200).json({
        message: "Youre Posted Job Fatch Successfully.",
        success: true,
        totalJob,
        myjob
    })
})

//Delete a single Job;

export const deleteJob = catchAsyncErrors(async (req,resp,next)=>{
    const {id} = req.params;
    const job=await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Oops! Job Not Fonud.",404));
    }
    await Job.deleteOne(id);
    return resp.status(200).json({
        message:"Job Delete Successfully.",
        success:true,
    })
})


// Get a single Job 

export const getASingleJob=catchAsyncErrors(async(req,resp,next)=>{

})


