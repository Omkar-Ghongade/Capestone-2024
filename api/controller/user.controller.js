import user from "../models/user.models.js";
import team from "../models/team.models.js";
import Finalproject from '../models/finalproject.models.js';
import Demodata from "../models/demo.models.js";
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

export const getallusers = async (req, res) => {
    try{
        const Users = await user.find();
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