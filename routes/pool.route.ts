import { Router } from 'express';
import { getPoolDetails, getPools } from '../controllers/pool.controller';

const router = Router();

router.get('/pools', getPools);
router.get('/pools/:id', getPoolDetails as any); // GET /api/pools/1

export default router;