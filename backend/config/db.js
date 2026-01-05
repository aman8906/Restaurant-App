import mongoose, { connect } from "mongoose";

export const connectDB=async(req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected")
    } catch(error){
        console.log('error in connecting.....${error}')

    }
}