import mongoose, { model } from "mongoose";

const finalprojectdata=new mongoose.Schema({
    applyReason:{type:String,required:true},
    projectId:{type:String,required:true},
    projectName:{type:String,required:true},
    projectDomain:{type:Array,required:true},
    projectProfessor:{type:String,required:true},
    projectDescription:{type:String,required:true},
    teamcode:{type:String,required:true},
    studentId:{type:String,required:true},
    isaccepted:{type:Boolean,required:true},
    reports:{type:Array}
});

const Finalproject=mongoose.model('finalprojectdata',finalprojectdata);
Finalproject.createIndexes();

export default Finalproject;