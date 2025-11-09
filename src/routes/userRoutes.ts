import express, { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';

const router: Router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/forgotPassword', authController.forgotPassword);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;
