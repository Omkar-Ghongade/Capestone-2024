import project from '../models/project.models.js';
import Finalproject from '../models/finalproject.models.js';
import Appliedproject from '../models/applied.project.models.js';
import team from '../models/team.models.js';
import studentdata from '../models/student.models.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

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


        req.body.cgpa=Team.cgpa;
        req.body.teamcode = teamcode;
        req.body.specialization = Team.specialization;
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
        const allappliedproject = await Appliedproject.find({teamcode:req.body.teamcode});
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
        // console.log(findProject)
        await findproject.save();

        

        // accepted the project
        const findProject= await Appliedproject.findOne({projectName:projectName, teamcode: teamcode });

        if(findProject.isaccepted){
            return res.status(400).json({message:"Project already accepted"});
        }

        findProject.isaccepted = true;
        // console.log(findProject);
        await findProject.save();

        


        // rejected all other projects by that team 
        const teamapplications = await Appliedproject.find({teamcode:teamcode});
        for(var i=0;i<teamapplications.length;i++){
            if(teamapplications[i].projectName!==projectName){
                teamapplications[i].isrejected = true;
                await teamapplications[i].save();
            }
        }

        // console.log(teamapplications);

        // reject all applications for that project
        const projectapplications = await Appliedproject.find({projectName:projectName});
        for(var i=0;i<projectapplications.length;i++){
            if(projectapplications[i].teamcode!==teamcode){
                projectapplications[i].isrejected = true;
                await projectapplications[i].save();
            }
        }

        // console.log(projectapplications);


        const { _id, __v, ...cleanFindProject } = findProject.toObject();
        cleanFindProject.isaccepted = true;
        const Team = await team.findOne({ teamcode: teamcode });
        cleanFindProject.cgpa=Team.cgpa;
        cleanFindProject.specialization = Team.specialization;
        console.log(cleanFindProject);
        const finalproject = new Finalproject(cleanFindProject);
        console.log("here");
        const newfinalProject = await finalproject.save();
        res.status(200).json({message:"Project Accepted"});
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

export const getacceptedproject = async (req, res) => {
    try{
        const teamcode=req.body.teamcode;
        const allappliedproject = await Finalproject.find({ teamcode: teamcode });
        res.status(200).json(allappliedproject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}


export const oncancelproject = async (req, res) => {
    try{
        const projectName=req.body.projectName;
        const teamcode=req.body.teamcode;
        const findProject= await Appliedproject.findOneAndDelete({projectName:projectName, teamcode: teamcode });
        res.status(200).json({message:"Project Cancelled"});
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const isteamproject = async (req, res) => {
    try{
        const teamcode=req.body.teamcode;
        const projectName=req.body.projectName;
        const findProject= await Appliedproject.findOne({projectName:projectName, teamcode: teamcode });
        res.status(200).json(findProject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const isteamprojectaccept = async (req, res) => {
    try{
        const teamcode=req.body.teamcode;
        const findProject= await Finalproject.findOne({teamcode: teamcode });
        res.status(200).json(findProject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}



export const sendemail = async (req, res) => {
    try {
        const teamcode = req.body.teamcode;
        const Team = await team.findOne({ teamcode: teamcode });
        const teammembers = Team.teammembers;

        console.log(teammembers);

        for (const member of teammembers) {
            const student = await studentdata.findOne({ rollNumber: member });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });

            const mailOptions = {
                from: {
                    name: 'Capestone 2024',
                    address: process.env.EMAIL,
                },
                to: student.emailid,
                subject: 'Project Accepted',
                text: 'Your project has been accepted',
                html: '<h1>Your project has been accepted</h1>'
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent to", student.emailid);
        }

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (err) {
        console.error("Error sending emails:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const saveEditProject = async (req, res) => {
    try{
        const findProjectName = req.body.editProject.name;
        const findProjectProfessor = req.body.editProject.professor;
        const findProject = await project.findOne({name:findProjectName, professor:findProjectProfessor});
        const findappliedproject = await Appliedproject.find({projectName:findProjectName});
        for(var i=0;i<findappliedproject.length;i++){
            findappliedproject[i].projectName = req.body.name;
            findappliedproject[i].projectDescription = req.body.description;
            findappliedproject[i].save();
        }
        console.log(findProject);
        findProject.name = req.body.name;
        findProject.description = req.body.description;
        findProject.minteamsize = req.body.minteamsize;
        findProject.maxteamsize = req.body.maxteamsize;
        findProject.domains = req.body.domains;
        findProject.save();
        console.log(findProject);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const saveEditProjectTitle = async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log('Request Body:', req.body);

        const findProjectName = req.body.editProject.name;
        const findProjectProfessor = req.body.editProject.professor;
        
        // Find the project
        const findProject = await project.findOne({ name: findProjectName, professor: findProjectProfessor });
        if (!findProject) {
            console.log("Project not found");
            return res.status(404).json({ message: "Project not found" });
        }
        console.log("Project found:", findProject);

        // Find the applied projects
        const findappliedproject = await Appliedproject.find({ projectName: findProjectName });
        console.log("Applied projects found:", findappliedproject.length);

        // Find the final project
        const findfinalProject = await Finalproject.findOne({ projectName: findProjectName });
        if (!findfinalProject) {
            console.log("Final project not found");
            return res.status(404).json({ message: "Final project not found" });
        }
        console.log("Final project found:", findfinalProject);

        // Update the applied projects' names
        for (let i = 0; i < findappliedproject.length; i++) {
            findappliedproject[i].projectName = req.body.name;
            await findappliedproject[i].save(); // Ensure to await the save operation
        }

        // Update the final project's name
        findfinalProject.projectName = req.body.name;
        await findfinalProject.save(); // Ensure to await the save operation

        // Update the project's name
        findProject.name = req.body.name;
        await findProject.save(); // Ensure to await the save operation

        console.log("Project updated successfully");
        res.status(200).json({ message: "Project updated successfully" });
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).json({ message: err.message }); // Use status 500 for server errors
    }
};


export const getProjectSpecs = async (req, res) => {
    try {
        const projects = await project.find();  // Assuming 'project' is a model from Mongoose or similar ORM
        let domainCount = 0;
        let individualDomainCounts = {};

        // Iterate over each project and update domain counts
        projects.forEach(project => {
            if (project.domains && Array.isArray(project.domains)) {
                domainCount += project.domains.length;

                // Count each individual domain
                project.domains.forEach(domain => {
                    if (individualDomainCounts[domain]) {
                        individualDomainCounts[domain]++;
                    } else {
                        individualDomainCounts[domain] = 1;
                    }
                });
            }
        });

        // Send the total count of domains and individual domain counts in the response
        res.status(200).json(
            individualDomainCounts
        );
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getTeamprojects = async (req, res) => {
    try {
        const rollNumber = req.body.rollNumber;
        const Team = await team.findOne({ teammembers: rollNumber });
        const teamcode = Team.teamcode;
        const teamprojects = await Appliedproject.find({ teamcode : teamcode });
        res.status(200).json(teamprojects);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}