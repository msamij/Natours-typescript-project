import express, { Router } from 'express';
import * as viewController from '../controllers/viewsController.js';

const router: Router = express.Router();

router.get('/', viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);

export default router;
