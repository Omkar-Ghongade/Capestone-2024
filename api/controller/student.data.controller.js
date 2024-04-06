import studentdata from '../models/student.models.js';

export const getstudentdata = async (req, res) => {
    const email = req.body.emailid;
    const newPhotoUrl = req.body.url;
    console.log(req);
    try{
        const user= await studentdata.findOne({emailid:email});
        if(!user) 
            return res.status(404).json({message:"User not found"});
        if (newPhotoUrl) {
            user.photo = newPhotoUrl;
            await user.save(); // Save the updated user
        }
        return res.status(200).json(user);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}