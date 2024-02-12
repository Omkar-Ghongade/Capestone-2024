import user from "../models/user.models.js";
import jwt from 'jsonwebtoken';

export const getuser = async (req, res) => {
    console.log(req);
    const email = req.body.emailid;
    try{
        const User = await user.findOne({emailid:email});
        if(!User) 
            return res.status(404).json({message:"User not found"});
        const token=jwt.sign({id:User._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie('access_token',token,{httpOnly:true,expiresIn:'7d'}).status(200).json(User);
        // console.log(User.role);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}