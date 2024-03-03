import mongoose, { model } from "mongoose";

const appliedprojectdata=new mongoose.Schema({
    applyReason:{type:String,required:true},
    projectId:{type:String,required:true},
    projectName:{type:String,required:true},
    projectDomain:{type:String,required:true},
    projectProfessor:{type:String,required:true},
    teamcode:{type:String,required:true},
    studentId:{type:String,required:true}
});

const Appliedproject=mongoose.model('appliedprojectdata',appliedprojectdata);
Appliedproject.createIndexes();

export default Appliedproject;