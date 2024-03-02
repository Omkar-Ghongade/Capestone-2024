import express from 'express';
import {getprofessordata} from '../controller/professor.controller.js';

const router = express.Router();

router.post('/getprofessordata',getprofessordata);

export default router;