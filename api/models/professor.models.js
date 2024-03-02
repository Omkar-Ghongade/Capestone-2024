import mongoose, { model } from "mongoose";

const professordata=new mongoose.Schema({
    name:{type:String,required:true},
    profilelink:{type:String,required:true},
    profilephoto:{type:String,required:true}
});

const user=mongoose.model('professordata',professordata);

user.createIndexes();

export default user;