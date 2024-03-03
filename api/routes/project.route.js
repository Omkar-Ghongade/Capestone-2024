import express from 'express';
import {getprojectdata} from '../controller/project.controller.js';

const router = express.Router();

router.post('/getprojectdata',getprojectdata);

export default router;