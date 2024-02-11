import user from "../models/user.models.js";

export const getuser = async (req, res) => {
    const email = req.body.emailid;
    try{
        const User = await user.findOne({emailid:email});
        if(!User) 
            return res.status(404).json({message:"User not found"});
    }catch(err){
        res.status(404).json({message:err.message});
    }
}