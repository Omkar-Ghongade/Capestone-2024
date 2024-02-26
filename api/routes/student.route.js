import express from 'express';
import {getstudentdata} from '../controller/student.data.controller.js';

const router = express.Router();

router.post('/getstudentdata',getstudentdata);

export default router;