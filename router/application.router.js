import express from "express"
import { isAuthenticated,isAuthorized } from "../middleware/auth.js";
import { deleteApplication, employerGetAllApllication,jobSeekerGetAllApplication,postApplication } from "../controllers.js/applicationController.js";

 const applicationRouter= express.Router();

 applicationRouter.post("/post/:id",isAuthenticated,isAuthorized("Jok Seeker"),postApplication);
 applicationRouter.get("/employer/getall",isAuthenticated,isAuthorized("Employer"),employerGetAllApllication);
 applicationRouter.get("/jobseeker/getall",isAuthenticated,isAuthorized("Job Seeker"),jobSeekerGetAllApplication);
 applicationRouter.delete("/delete",isAuthenticated,deleteApplication);


 export default applicationRouter;
