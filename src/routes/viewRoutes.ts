import express, { Router } from 'express';
import * as viewController from '../controllers/viewsController.js';
import { isLoggedIn, protect } from '../controllers/authController.js';

const router: Router = express.Router();

router.use(isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
router.get('/me', protect, viewController.getAccount);

export default router;
