import adminlimit from "../models/admin.limits.model.js";

export const getLimits = async (req, res) => {
    try{
        console.log("getLimits");
    }catch(error){
        console.log(error);
    }
}

export const updateLimits = async (req, res) => {
    try{
        const {maxteamsize,minteamsize,maxprofessorproject,maxstudentapplications} = req.body;
        const limits = await adminlimit.findOne();
        limits.maxteamsize = maxteamsize;
        limits.minteamsize = minteamsize;
        limits.maxprofessorproject = maxprofessorproject;
        limits.maxstudentapplications = maxstudentapplications;
        await limits.save();
        res.status(201).json("done");
    }catch(error){
        console.log(error);
    }
}