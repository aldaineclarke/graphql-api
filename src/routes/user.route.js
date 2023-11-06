import Router from 'express';
import UserController from '../controllers/api/user.controller.js';

export const userRouter = Router();

userRouter.get('/', UserController.getAllUsers);
userRouter.get('/:id', UserController.getUserById);
userRouter.patch('/:id', UserController.updateUserData);
userRouter.delete('/:id', UserController.deleteUser);


