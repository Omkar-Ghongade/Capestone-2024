import mongoose, { model } from "mongoose";

const demoData=new mongoose.Schema({
    name: {type:String, required: true},
    emailid: {type:String, required: true, unique: true}
});

const Demodata=mongoose.model('demoData',demoData);

Demodata.createIndexes();

export default Demodata;