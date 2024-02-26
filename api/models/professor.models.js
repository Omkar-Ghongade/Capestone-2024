import mongoose, { model } from "mongoose";

const professordata=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true, unique:true},
    password:{type:String,required:true},
    school: {type:String, required: true},
    department:{type:String,required:true},
    designation:{type:String,required:true},
    contactNumber:{type:String,required:true,unique:true}
});

const user=mongoose.model('professordata',professordata);

professordata.createIndexes();

export default professordata;