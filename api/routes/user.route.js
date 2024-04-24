import express from 'express';
import {getuser} from '../controller/user.controller.js';
import {getteam} from '../controller/user.controller.js';
import {getproject} from '../controller/user.controller.js';
import { uploadUsers } from '../controller/user.controller.js';
import { getallusers } from '../controller/user.controller.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage:storage});   

router.post('/getdata',getuser);
router.post('/getteam',getteam);
router.post('/getproject',getproject);
router.post('/uploadUsers',upload.single('file'),uploadUsers);
router.get('/getallusers',getallusers);

export default router;