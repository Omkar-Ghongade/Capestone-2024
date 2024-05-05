import professordata from '../models/professor.models.js';
import projectdata from '../models/project.models.js';
import Finalproject from '../models/finalproject.models.js';
import teamdata from '../models/team.models.js';

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

export const professorData = async (req, res) => {
    try {
        const professorfinalprojects = await Finalproject.find();
        console.log(professorfinalprojects);
        const professorStudentCount = {};
        for (const professor of professorfinalprojects) {
            professorStudentCount[professor.projectProfessor] = 0;
        }
        for (const project of professorfinalprojects) {
            const teamCode = project.teamcode;
            const team = await teamdata.findOne({ teamcode: teamCode });
            console.log(team);
            if (team) {
                professorStudentCount[project.projectProfessor] += team.teammembers.length;
            }
        }

        const professorDetailsProjects = [];
        for (const [professor, count] of Object.entries(professorStudentCount)) {
            const Professor = {};
            Professor.name = professor;
            Professor.students = count;
            const finalproject = await Finalproject.find({ projectProfessor: professor });
            Professor.projects = finalproject.length;
            professorDetailsProjects.push(Professor);
        }
        

        res.status(200).json(professorDetailsProjects);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}
