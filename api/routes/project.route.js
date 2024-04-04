import express from 'express';
import {getprojectdata} from '../controller/project.controller.js';
import {applyproject} from '../controller/project.controller.js';
import {getappliedproject} from '../controller/project.controller.js';
import {createproject} from '../controller/project.controller.js';
import {deleteproject} from '../controller/project.controller.js';
import {acceptproject} from '../controller/project.controller.js';
import {rejectproject} from '../controller/project.controller.js';
import {displayacceptedproject} from '../controller/project.controller.js';
import {addreportlink} from '../controller/project.controller.js';
import {getprofessorproject} from '../controller/project.controller.js';

const router = express.Router();

router.post('/getprojectdata',getprojectdata);
router.post('/applyproject',applyproject);
router.post('/getappliedproject',getappliedproject);
router.post('/createproject',createproject);
router.post('/deleteproject',deleteproject);
router.post('/acceptproject',acceptproject);
router.post('/rejectproject',rejectproject);
router.post('/displayacceptedproject',displayacceptedproject);
router.post('/addreportlink',addreportlink);
router.post('/getprofessorproject',getprofessorproject);

export default router;