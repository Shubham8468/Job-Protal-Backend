import express from "express";
import { postjob,getAllJobs,postByMe,deleteJob,getASingleJob} from "../controllers.js/jobController.js";
import { isAuthenticated,isAuthorized } from "../middleware/auth.js";

const jobRouter= express.Router();



jobRouter.post("/post",isAuthenticated,isAuthorized("Employer"),postjob);
jobRouter.get('/alljobs',isAuthenticated,getAllJobs);
jobRouter.get("/postbyme",isAuthenticated,isAuthorized("Employer"),postByMe);
jobRouter.delete("/delete/:id",isAuthenticated,isAuthorized("Employer"),deleteJob);
jobRouter.get("/get/:id",isAuthenticated,getASingleJob);
export default jobRouter;