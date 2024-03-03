import express from 'express';
import {getprojectdata} from '../controller/project.controller.js';
import {applyproject} from '../controller/project.controller.js';
import {getappliedproject} from '../controller/project.controller.js';

const router = express.Router();

router.post('/getprojectdata',getprojectdata);
router.post('/applyproject',applyproject);
router.post('/getappliedproject',getappliedproject);

export default router;