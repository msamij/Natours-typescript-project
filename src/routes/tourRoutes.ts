import express, { Router } from 'express';
import * as tourController from '../controllers/tourController.js';

const router: Router = express.Router();

router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

export default router;
