import mongoose from "mongoose";

 export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://ankitkumar62601_db_user:54nr2T8XXylk5dpe@cluster0.ghao9qd.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}