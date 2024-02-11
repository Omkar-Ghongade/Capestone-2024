import mongoose, { model } from "mongoose";

const User=new mongoose.Schema({
    emailid: {type:String, required: true, unique: true},
    role: {type:String, required: true},
});

const user=mongoose.model('User',User);

user.createIndexes();

export default user;