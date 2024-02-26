import mongoose, { model } from "mongoose";

const admindata=new mongoose.Schema({
    name: {type:String, required: true},
    email:{type:String,required:true, unique:true},
    contactNumber:{type:String,required:true,unique:true}
});

const user=mongoose.model('admindata',admindata);
admindata.createIndexes();

export default admindata;  