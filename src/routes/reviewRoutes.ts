import express, { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import * as reviewController from '../controllers/reviewController.js';

const router: Router = express.Router({
  mergeParams: true,
});

router.route('/').get(reviewController.getAllReviews).post(protect, restrictTo('user'), reviewController.createReview);

export default router;
