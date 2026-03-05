import express, { Router } from 'express';
import { isLoggedIn, protect } from '../controllers/authController.js';
import * as viewsController from '../controllers/viewsController.js';

const router: Router = express.Router();

router.get('/', isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', isLoggedIn, viewsController.getTour);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.get('/me', protect, viewsController.getAccount);

router.post('/submit-user-data', protect, viewsController.updateUserData);

export default router;
