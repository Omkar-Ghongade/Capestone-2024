import team from "../models/team.models.js";
import studentdata from '../models/student.models.js';
import Finalproject from "../models/finalproject.models.js";

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
        const student = await studentdata.findOne({rollNumber:req.body.studentId});
        const Team = new team({
            teamcode: teamId,
            teammembers: req.body.studentId,
            cgpa : student.cgpa,
            specialization : student.specialization
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
        if(teamFind.isopen){
            const student = await studentdata.findOne({rollNumber:req.body.studentId});
            teamFind.cgpa.push(student.cgpa);
            teamFind.specialization.push(student.specialization);
            teamFind.teammembers.push(req.body.studentId);
            const newteam = await teamFind.save();
            res.status(201).json(newteam);
        }else{
            res.status(404).json({message:"Team is closed"});
        }
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
        teamFind.isopen=false;
        const newteam = await teamFind.save();
        res.status(201).json(newteam);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const teamgraph = async (req, res) => {
    try {
        const teams = await team.find();
        const allStudents = await studentdata.find()
        const totalStudents = allStudents.length;
        let studentsInTeams = 0;
        teams.forEach(team => {
            if (team.teammembers && Array.isArray(team.teammembers)) {
                studentsInTeams += team.teammembers.length;
            }
        });
        const studentsNotInTeams = totalStudents - studentsInTeams;
        res.status(200).json({
            totalStudents: totalStudents,
            studentsInTeams: studentsInTeams,
            studentsNotInTeams: studentsNotInTeams
        });
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

export const teamprojectgraph = async (req, res) => {
    try{
        const teams = await team.find();
        const projects = await Finalproject.find();
        const teaminProject=projects.length;
        const teamsNotInProject=teams.length-projects.length;
        res.status(200).json({
            teamsinProject:teaminProject,
            teamsNotInProject:teamsNotInProject
        });
    }catch(err){
        res.status(404).json({ message: err.message });
    }
}