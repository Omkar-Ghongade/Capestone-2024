import studentdata from '../models/student.models.js';

export const getstudentdata = async (req, res) => {
    console.log(req);
    const email = req.body.emailid;
    try{
        const user= await studentdata.findOne({emailid:email});
        if(!user) 
            return res.status(404).json({message:"User not found"});
        return res.status(200).json(user);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}