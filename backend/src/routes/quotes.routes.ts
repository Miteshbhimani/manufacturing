import { Router } from 'express';
import { authenticateToken, requireSalesOrAdmin } from '../modules/auth/middleware/auth.middleware';
import { quoteController } from '../controllers/quote.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Quote management routes
router.get('/', quoteController.getAllQuotes.bind(quoteController));
router.get('/:id', quoteController.getQuoteById.bind(quoteController));
router.post('/', requireSalesOrAdmin, quoteController.createQuote.bind(quoteController));
router.put('/:id', requireSalesOrAdmin, quoteController.updateQuote.bind(quoteController));
router.delete('/:id', requireSalesOrAdmin, quoteController.deleteQuote.bind(quoteController));

export default router;
