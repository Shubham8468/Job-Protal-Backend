import mongoose from "mongoose";

export const connectDB= async ()=>
{
    try{
        const db_Url=process.env.MONGO_URL
        if(!db_Url){
            throw new Error("MongoDB Url Misssing in .env file")
        }
        await mongoose.connect(db_Url,{
            dbName:"job-portel"
        }).then(()=>{
            console.log("DB connected !")
        })
    }catch(error){
        console.log(`DB not connected ${error.message || error}`)
    }
    
}