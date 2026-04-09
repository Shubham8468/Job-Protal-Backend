import app from "./app.js"
import cloudinary from "cloudinary"

const port = Number.parseInt(process.env.PORT, 10) || 4000;
// Now i set Cloudinary to Backend 
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

app.listen(port,()=>{
    console.log(`Server is Runing on PORT ${port}`)
})