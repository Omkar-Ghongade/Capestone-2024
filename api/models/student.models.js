import mongoose, { model } from "mongoose";

const studentData=new mongoose.Schema({
    name: {type:String, required: true},
    emailid: {type:String, required: true, unique: true},
    rollNumber : {type:String, required: true, unique: true},
    school : {type:String, required: true},
    stream : {type:String, required: true},
    semester : {type:String, required: true},
    section : {type:String, required: true},
    gender : {type:String, required: true},
    contactNumber : {type:String, required: true, unique: true},
    photo: {type:String, required: false},
    cgpa: {type:String, required: true},
    specialization: {type:String, required: true},
});

const studentdata=mongoose.model('studentdata',studentData);

studentdata.createIndexes();

export default studentdata;