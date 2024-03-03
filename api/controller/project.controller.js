import project from '../models/project.models.js';
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

