import project from '../models/project.models.js';

export const getprojectdata = async (req, res) => {
    try{
        const allprojectdata = await project.find();
        res.status(200).json(allprojectdata);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}