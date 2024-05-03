import express from 'express';
import {getstudentdata} from '../controller/student.data.controller.js';
import { downloaddata } from '../controller/student.data.controller.js';

const router = express.Router();

router.post('/getstudentdata',getstudentdata);
router.get('/downloaddata',downloaddata);

export default router;