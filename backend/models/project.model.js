import mongoose from "mongoose";

const stepSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     status:{
        type:String,
        enum:['Not Started','In progress','Completed'],
        default:'Not Started',
        required:true
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
    steps: [stepSchema], 
    createdAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: Date,
    updatedAt: Date,
    completedAt:Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Project= mongoose.model('Project',projectSchema);

export default Project;