import user from "../models/user.models.js";
import team from "../models/team.models.js";
import Finalproject from '../models/finalproject.models.js';
import studentdata from "../models/student.models.js";
import jwt from 'jsonwebtoken';
import xlsx from 'xlsx';

export const getuser = async (req, res) => {
    console.log(req);
    const email = req.body.emailid;
    try{
        const User = await user.findOne({emailid:email});
        if(!User) 
            return res.status(404).json({message:"User not found"});
        const token=jwt.sign({id:User._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie('access_token',token,{httpOnly:true,expiresIn:'7d'}).status(200).json(User);
        // console.log(User.role);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getteam = async (req, res) => {
    try{
        const rollNumber = req.body.rollNumber;
        const Team = await team.findOne({teammembers:rollNumber});
        res.status(200).json(Team);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getproject = async (req, res) => {
    try{
        const teamcode = req.body.teamcode;
        const Project = await Finalproject.findOne({teamcode:teamcode});
        res.status(200).json(Project);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const uploadUsers = async (req, res) => {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    user.insertMany(data)
    .then(() => {
      res.status(200).send('Data uploaded successfully');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error uploading data');
    });
}

export const uploadStudents = async (req, res) => {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    studentdata.insertMany(data)
    .then(() => {
      res.status(200).send('Data uploaded successfully');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error uploading data');
    });
}

export const getallusers = async (req, res) => {
    try{
        const Users = await user.find();
        res.status(200).json(Users);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getallstudents = async (req, res) => {
    try{
        const Users = await studentdata.find();
        res.status(200).json(Users);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const edituser = async (req, res) => {
    try{
        const pemail = req.body.pemailid;
        const email = req.body.emailid;
        const role = req.body.role;
        const User = await user.findOne({emailid:pemail});
        User.emailid = email;
        User.role = role;
        User.save();
        res.status(200).json({message:"User edited successfully"});
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const editstudent = async (req, res) => {
    try{
        
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const deleteuser = async (req, res) => {
    try{
        const email = req.body.emailid;
        const User = await user.deleteOne({emailid:email});
        res.status(200).json({message:"User deleted successfully"});
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const deletestudent = async (req, res) => {
    try{
        const email = req.body.emailid;
        const User = await studentdata.deleteOne({emailid:email});
        const nUser = await user.deleteOne({emailid:email});
        res.status(200).json({message:"User deleted successfully"});
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const adduser = async (req, res) => {
    try{
        const {emailid,role} = req.body;
        const newUser = new user({emailid,role});
        newUser.save();
        res.status(200).json({message:"User added successfully"});
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const addstudent = async (req, res) => {
    try{
        const name=req.body.name;
        const emailid=req.body.emailid;
        const rollNumber=req.body.rollNumber;
        const school=req.body.school;
        const stream=req.body.stream;
        const semester=req.body.semester;
        const section=req.body.section;
        const gender=req.body.gender;
        const contactNumber=req.body.contactnumber;
        
        const User = await user({emailid:req.body.emailid,role:"student"});
        User.save();
        
        const newUser = await studentdata({name:name, emailid:emailid,rollNumber:rollNumber, school:school, stream:stream, semester:semester, section:section, gender:gender, contactNumber:contactNumber});
        console.log(newUser);
        newUser.save();
        res.status(200).json({message:"User added successfully"});
    }catch(err){
        res.status(404).json({message:err.message});
    }
}