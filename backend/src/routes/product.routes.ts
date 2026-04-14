import { Router } from 'express';
import { getProducts, syncEncoreProducts, getCategories, seedCategories } from '../controllers/product.controller';

const router = Router();
router.get('/seed-categories', seedCategories);
router.get('/categories', getCategories);
router.get('/sync', syncEncoreProducts);
router.get('/', getProducts);
export default router;
