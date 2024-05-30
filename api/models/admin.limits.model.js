import mongoose, { model } from "mongoose";

const adminlimit=new mongoose.Schema({
    maxteamsize : {type:Number,required:true},
    minteamsize : {type:Number,required:true},
    maxprofessorproject : {type:Number,required:true},
    maxstudentapplications : {type:Number,required:true}
});

const adminLimit=mongoose.model('adminlimit',adminlimit);
// adminlimit.createIndexes();

export default adminLimit;