import mongoose from "mongoose";

export const stepSchema=new mongoose.Schema({
    name:{
        type:String,
    },
     status:{
        type:String,
        enum:['Not Started','In progress','Completed'],
        
    },
    order: Number,
    startedAt: Date,
    completedAt: Date

},{id:false})
const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    priority:{
        type:String,
        required:true,
        enum:['High','Medium','Low'],
        default:'Low'
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        enum:['Not Started','In progress','Completed'],
        default:'Not Started',
        required:true
    },
    steps:{
        type: [stepSchema],
        default:[]
    }, 
    createdAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: {
        type:Date
    },
    updatedAt: {
        type:Date
    },
    completedAt:{
        type:Date
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Project= mongoose.model('Project',projectSchema);

export default Project;