import mongoose, { model } from "mongoose";

const Team=new mongoose.Schema({
    teamcode:{type:String,required:true},
    teammembers:{type:Array,required:true},
    submitted:{type:Boolean,default:false},
    isopen:{type:Boolean,default:true},
    cgpa:{type:Array,default:[],required:true},
    specialization:{type:Array,default:[],required:true},
    marks: { type: Array, default: [], required: true }
});

const team=mongoose.model('Team',Team);

// team.createIndexes();

export default team;