import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";


const userSchema= new mongoose.Schema({

    userMail:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    userName: {
        type: String,
        required: [true],
        trim: true,
        minlength: [3],
        maxlength: [30]
    },
    password: {
        type: String,
        required: [true],
        minlength: [8],
        select: false 
    },
    isVerified: {
         type: Boolean,
          default: false 
    },
    verificationCode: String, 
    verificationCodeExpires: Date,
    passwordChangedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});





const User = mongoose.model("User", userSchema);
export default User;