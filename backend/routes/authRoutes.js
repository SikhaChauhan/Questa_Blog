import express from 'express';
import { google, signin, signup, forgotPassword, resetPassword } from '../controllers/authController.js';
const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/google', google);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword); // Route for resetting password

export default router;
