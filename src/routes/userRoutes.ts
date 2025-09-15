import express, { Router } from 'express';
import * as userController from '../controllers/userController.js';

const router: Router = express.Router();

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;
