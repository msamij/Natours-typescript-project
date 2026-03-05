import express, { Router } from 'express';
import { isLoggedIn, protect } from '../controllers/authController.js';
import * as viewController from '../controllers/viewsController.js';

const router: Router = express.Router();

router.get('/', isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', isLoggedIn, viewController.getTour);
router.get('/login', isLoggedIn, viewController.getLoginForm);
router.get('/me', protect, viewController.getAccount);

export default router;
