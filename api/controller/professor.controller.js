import professordata from '../models/professor.models.js';
import projectdata from '../models/project.models.js';

export const getprofessordata = async (req,res) => {
    try{
        const allprofessordata = await professordata.find();
        res.status(200).json(allprofessordata);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const displayprofessordata = async (req,res) => {
    try{
        const email = req.body.emailid;
        const singleprofessordata = await professordata.findOne({emailid:email});
        res.status(200).json(singleprofessordata);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const professorchartdata = async (req,res) => {
    try{
        const allProfessors = await professordata.find();
        const allProjects = await projectdata.find();

        const professorProjects = {};

        allProfessors.forEach(professor => {
            const professorProjectsCount = allProjects.filter(project => project.professor === professor.name).length;
            professorProjects[professor.name] = professorProjectsCount;
        });
        
        res.status(200).json(professorProjects);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}