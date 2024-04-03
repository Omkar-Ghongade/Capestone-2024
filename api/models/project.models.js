import mongoose, { model } from "mongoose";

const projectdata=new mongoose.Schema({
    name:{type:String,required:true},
    professor:{type:String,required:true},
    description : {type:String,required:true},
    domains : {type:Array,required:true},
    minteamsize : {type:String,required:true},
    maxteamsize : {type:String,required:true},
});


const project=mongoose.model('projectdata',projectdata);
project.createIndexes();

export default project;