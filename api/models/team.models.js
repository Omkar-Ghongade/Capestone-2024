import mongoose, { model } from "mongoose";

const Team=new mongoose.Schema({
    teamcode:{type:String,required:true},
    teammembers:{type:Array,required:true},
    submitted:{type:Boolean,default:false}
});

const team=mongoose.model('Team',Team);

team.createIndexes();

export default team;