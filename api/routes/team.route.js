import express from 'express';
import { createTeam } from '../controller/team.controller.js';
import { joinTeam } from '../controller/team.controller.js';
import { deleteTeam } from '../controller/team.controller.js';

const router = express.Router();

router.post('/createteam',createTeam);
router.post('/jointeam',joinTeam);
router.post('/deleteteam',deleteTeam);

export default router;