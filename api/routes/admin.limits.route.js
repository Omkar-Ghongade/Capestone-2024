import express from 'express';
import { getLimits } from '../controller/admin.limits.controller.js';
import { updateLimits } from '../controller/admin.limits.controller.js';

const router = express.Router();

router.get('/getlimits', getLimits);
router.post('/updatelimits',updateLimits)

export default router;