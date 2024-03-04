import express from 'express';
import {getprofessordata} from '../controller/professor.controller.js';
import {displayprofessordata} from '../controller/professor.controller.js';

const router = express.Router();

router.post('/getprofessordata',getprofessordata);
router.post('/displayprofessordata',displayprofessordata);

export default router;