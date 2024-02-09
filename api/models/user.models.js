import mongoose from "mongoose";

const User= mongoose.model('User', {
    email:{typeof:String, required:true,unique:true},
    role:{typeof:String, required:true},
});

  