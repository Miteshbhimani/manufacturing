import { Router } from 'express';
import { productController } from '../controllers/product.controller';

const router = Router();

// Product routes (no authentication required for public access)
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

export default router;
