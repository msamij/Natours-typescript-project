import express, { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router: Router = express.Router();

router.route('/').get;

export default router;
