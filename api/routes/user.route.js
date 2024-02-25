import express from 'express';
import {getuser} from '../controller/user.controller.js';

const router = express.Router();

router.post('/getdata',getuser);

export default router;