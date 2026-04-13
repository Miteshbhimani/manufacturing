import { Router } from 'express';
import { getPage } from '../controllers/page.controller';

const router = Router();
router.get('/:slug', getPage);
export default router;
