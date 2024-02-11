import express from 'express';
import {getuser} from '../controller/user.controller.js';

const router = express.Router();

router.get('/getdata',getuser);

export default router;