import express from 'express';
import {getuser} from '../controller/user.controller.js';
import {getteam} from '../controller/user.controller.js';
import {getproject} from '../controller/user.controller.js';

const router = express.Router();

router.post('/getdata',getuser);
router.post('/getteam',getteam);
router.post('/getproject',getproject);

export default router;