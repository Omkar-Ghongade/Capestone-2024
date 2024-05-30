import mongoose, { model } from "mongoose";

const professordata=new mongoose.Schema({
    id:{type:String,required:true},
    name:{type:String,required:true},
    emailid:{type:String,required:true},
    designation:{type:String,required:true},
    profilelink:{type:String},
    profilephoto:{type:String}
});

const user=mongoose.model('professordata',professordata);

user.createIndexes();

export default user;