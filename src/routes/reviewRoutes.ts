import express, { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import * as reviewController from '../controllers/reviewController.js';

const router: Router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(protect, restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
