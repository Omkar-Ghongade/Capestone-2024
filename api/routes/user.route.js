import express from 'express';
import {getuser} from '../controller/user.controller.js';
import {getteam} from '../controller/user.controller.js';
import {getproject} from '../controller/user.controller.js';
import { uploadUsers } from '../controller/user.controller.js';
import { getallusers } from '../controller/user.controller.js';
import { edituser } from '../controller/user.controller.js';
import { deleteuser } from '../controller/user.controller.js';
import { adduser } from '../controller/user.controller.js';
import { uploadStudents } from '../controller/user.controller.js';
import { getallstudents } from '../controller/user.controller.js';
import { deletestudent } from '../controller/user.controller.js';
import { addstudent } from '../controller/user.controller.js';
import { editstudent } from '../controller/user.controller.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage:storage});   

router.post('/getdata',getuser);
router.post('/getteam',getteam);
router.post('/getproject',getproject);
router.post('/uploadUsers',upload.single('file'),uploadUsers);
router.get('/getallusers',getallusers);
router.post('/edituser',edituser);
router.post('/deleteuser',deleteuser);
router.post('/adduser',adduser);
router.post('/uploadStudents',upload.single('file'),uploadStudents);
router.post('/getallstudents',getallstudents);
router.post('/deletestudent',deletestudent);
router.post('/addstudent',addstudent);
router.post('/editstudent',editstudent);

export default router;