import professordata from '../models/professor.models.js';

export const getprofessordata = async (req,res) => {
    try{
        const allprofessordata = await professordata.find();
        res.status(200).json(allprofessordata);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}