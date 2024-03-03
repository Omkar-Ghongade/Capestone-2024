import project from '../models/project.models.js';
import Appliedproject from '../models/applied.project.models.js';

export const getprojectdata = async (req, res) => {
    try{
        const allprojectdata = await project.find();
        res.status(200).json(allprojectdata);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const applyproject = async (req, res) => {
    const { projectId, rollNumber } = req.body;
    try {
        const existingProject = await Appliedproject.findOne({ projectId, rollNumber });
        if (existingProject) {
            return res.status(409).json({ message: "Project with the same projectId and rollNumber already exists" });
        }
        const appliedproject = new Appliedproject(req.body);
        const newappliedproject = await appliedproject.save();
        res.status(201).json(newappliedproject);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}
