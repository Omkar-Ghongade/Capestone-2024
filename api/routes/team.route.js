import express from 'express';
import { createTeam } from '../controller/team.controller.js';
import { joinTeam } from '../controller/team.controller.js';
import { deleteTeam } from '../controller/team.controller.js';
import { isinTeam } from '../controller/team.controller.js';
import { submitTeam } from '../controller/team.controller.js';
import { teamgraph } from '../controller/team.controller.js';
import { teamprojectgraph } from '../controller/team.controller.js';
import { teammarks } from '../controller/team.controller.js';

const router = express.Router();

router.post('/createteam',createTeam);
router.post('/jointeam',joinTeam);
router.post('/deleteteam',deleteTeam);
router.post('/isinTeam',isinTeam);
router.post('/submitTeam',submitTeam);
router.get('/teamgraph',teamgraph);
router.get('/teamprojectgraph',teamprojectgraph);
router.get('/teammarks',teammarks);

export default router;