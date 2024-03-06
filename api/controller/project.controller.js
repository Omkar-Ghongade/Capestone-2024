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
        const newprojectdata = await newproject.save();
        res.status(201).json(newprojectdata);
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
        const projectid = req.body.projectId;
        const teamid = req.body.teamcode;
        const name = req.body.projectName;
        console.log(req.body)
        const deleteapplications1 = await Appliedproject.deleteMany({projectId:projectid});
        const deleteapplications2 = await Appliedproject.deleteMany({teamcode:teamid});
        const deleteapplications3 = await project.deleteMany({name});
        const finalproject = new Finalproject(req.body);
        const newfinalproject = await finalproject.save();
        res.status(201).json(newfinalproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const rejectproject = async (req, res) => {
    try{
        const projectid = req.body.projectId;
        const teamid = req.body.teamcode;
        const deleteapplications1 = await Appliedproject.deleteMany({projectId:projectid,teamcode:teamid});
        res.status(200).json(deleteapplications1);
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