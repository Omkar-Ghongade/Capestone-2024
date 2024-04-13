import project from '../models/project.models.js';
import Finalproject from '../models/finalproject.models.js';
import Appliedproject from '../models/applied.project.models.js';
import team from '../models/team.models.js';

export const getprojectdata = async (req, res) => {
    try{
        const allprojectdata = await project.find();
        res.status(200).json(allprojectdata);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getaprojectdata = async (req, res) => {
    try{
        const projectname = req.body.projectname;
        const projectdata = await project.findOne({name:projectname})
        res.status(200).json(projectdata);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const applyproject = async (req, res) => {
    try {
        const rollNumber = req.body.studentId;
        const Team = await team.findOne({ teammembers: rollNumber });
        const teamcode = Team.teamcode;
        
        const existingAppliedProject = await Appliedproject.find({ teamcode: teamcode });
        console.log(existingAppliedProject);
        for(var i=0;i<existingAppliedProject.length;i++){
            if (existingAppliedProject[i].projectId===req.body.projectId) {
                return res.status(400).json({ message: "Team has already applied for a project" });
            }
        }

        req.body.teamcode = teamcode;
        console.log(req.body);
        req.body.isaccepted = false;
        req.body.isrejected = false;
        const appliedproject = new Appliedproject(req.body);
        const newappliedproject = await appliedproject.save();
        res.status(201).json(newappliedproject);
        
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}


export const getappliedproject = async (req, res) => {
    try{
        const allappliedproject = await Appliedproject.find({teamId:req.body.teamId});
        res.status(200).json(allappliedproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}


export const createproject = async (req, res) => {
    try{
        const newproject = new project(req.body);
        newproject.isopen=true;
        const newprojectdata = await newproject.save();
        res.status(201).json(newprojectdata);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getprofessorproject = async (req, res) => {
    try{
        console.log(req.body);
        const profproject = await project.find({professor:req.body.name});
        res.status(200).json(profproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const deleteproject = async (req, res) => {
    try{
        const projectname = req.body.name;
        const deletedproject = await project.findOneAndDelete({name:projectname});
        const deleteapplications = await Appliedproject.deleteMany({projectId:deletedproject._id});
        res.status(200).json(deletedproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const acceptproject = async (req, res) => {
    try{
        const projectName=req.body.projectName;
        const teamcode=req.body.teamcode;

        // closed the project
        const findproject = await project.findOne({name:projectName});
        findproject.isopen = false;
        await findproject.save();

        // accepted the project
        const findProject= await Appliedproject.findOne({projectName:projectName, teamcode: teamcode });

        if(findProject.isaccepted){
            return res.status(400).json({message:"Project already accepted"});
        }

        findProject.isaccepted = true;
        await findProject.save();


        // rejected all other projects by that team 
        const teamapplications = await Appliedproject.find({teamcode:teamcode});
        for(var i=0;i<teamapplications.length;i++){
            if(teamapplications[i].projectName!==projectName){
                teamapplications[i].isaccepted = false;
                await teamapplications[i].save();
            }
        }

        // reject all applications for that project
        const projectapplications = await Appliedproject.find({projectName:projectName});
        for(var i=0;i<projectapplications.length;i++){
            if(projectapplications[i].teamcode!==teamcode){
                projectapplications[i].isaccepted = false;
                await projectapplications[i].save();
            }
        }


        const { _id, __v, ...cleanFindProject } = findProject.toObject();
        cleanFindProject.isaccepted = true;
        console.log(cleanFindProject);
        const finalproject = new Finalproject(cleanFindProject);
        console.log("here");
        const newfinalProject = await finalproject.save();
        res.status(200).json(newfinalProject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const rejectproject = async (req, res) => {
    try{
        const projectName=req.body.projectName;
        const teamcode=req.body.teamcode;
        const findProject= await Appliedproject.findOne({projectName:projectName, teamcode: teamcode });
        findProject.isrejected = true;
        await findProject.save();
        res.status(200).json(findProject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const displayacceptedproject = async (req, res) => {
    try{
        const teamcode=req.body.teamcode;
        const allappliedproject = await Finalproject.find({ teamcode: teamcode });
        res.status(200).json(allappliedproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const addreportlink = async (req, res) => {
    try{
        const teamcode=req.body.teamcode;
        const reportlink=req.body.reportlink;
        const allappliedproject = await Finalproject.findOneAndUpdate({ teamcode: teamcode}, { $push: { reports: reportlink } });
        res.status(200).json(allappliedproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getmyapplications = async (req, res) => {
    try{
        const name=req.body.name;
        const allappliedproject = await Appliedproject.find({ projectProfessor: name });
        res.status(200).json(allappliedproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getreportlink = async (req, res) => {
    try{
        const professorname=req.body.name;
        const allappliedproject = await Finalproject.find({ projectProfessor: professorname });
        res.status(200).json(allappliedproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}
