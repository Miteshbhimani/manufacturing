import { Router } from 'express';
import { handlePublicEnquiry } from '../controllers/public.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Basic rate limiting for public endpoint
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, error: 'Too many enquiries from this IP, please try again after 15 minutes' }
});

router.post('/enquiry', enquiryLimiter, handlePublicEnquiry);

export default router;
