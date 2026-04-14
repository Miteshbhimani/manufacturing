"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeString = exports.sanitizeHtml = exports.isValidPhone = exports.isValidEmail = exports.leadSchema = void 0;
const zod_1 = require("zod");
// Lead validation schema
exports.leadSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name must be less than 100 characters'),
    companyName: zod_1.z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    phone: zod_1.z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format').min(10, 'Phone number must be at least 10 digits'),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
    userId: zod_1.z.number().optional()
});
// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
// Phone validation (basic)
const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};
exports.isValidPhone = isValidPhone;
// Sanitize HTML to prevent XSS
const sanitizeHtml = (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
};
exports.sanitizeHtml = sanitizeHtml;
// Backend version of sanitizeHtml (for Node.js environment)
const sanitizeString = (str) => {
    return str
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim()
        .substring(0, 1000); // Limit length
};
exports.sanitizeString = sanitizeString;
