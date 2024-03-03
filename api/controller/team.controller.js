import team from "../models/team.models.js";

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

export const createTeam = async (req, res) => {
    try{
        const teamId = generateRandomString(8);
        // console.log(teamid);
        const Team = new team({
            teamcode: teamId,
            teammembers: req.body.studentId,
        });
        console.log(Team);
        const newteam = await Team.save();
        res.status(201).json(newteam);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const joinTeam = async (req, res) => {
    try{
        const teamFind=await team.findOne({teamcode:req.body.teamcode});
        teamFind.teammembers.push(req.body.studentId);
        const newteam = await teamFind.save();
        res.status(201).json(newteam);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const deleteTeam = async (req, res) => {
    try{
        const teamId = req.body.teamcode;
        const teamFind=await team.findOne({teamcode:teamId});
        const deletedTeam = await teamFind.deleteOne({ teamcode: teamId });
        res.status(200).json({ message: "Team deleted successfully" });
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const isinTeam = async (req, res) => {
    try{
        const teamFind=await team.findOne({teammembers:req.body.studentId});
        res.status(200).json(teamFind);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const submitTeam = async (req, res) => {
    try{
        const teamFind=await team.findOne({teamcode:req.body.teamcode});
        console.log(teamFind);
        teamFind.submitted=true;
        const newteam = await teamFind.save();
        res.status(201).json(newteam);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}