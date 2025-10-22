import express, { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router: Router = express.Router();

router.post('/signup', authController.signup);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;
