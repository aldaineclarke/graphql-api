import { Router } from 'express';
// import expressJwt from 'express-jwt';
import AuthController from '../controllers/api/auth.controller.js';
import UserController from '../controllers/api/user.controller.js';
import UserRequest from '../requests/user.request.js';
import { isAuthorized } from '../middlewares/authenticate.js';
import { userRouter } from './user.route.js';

// import HomeController from '../controllers/Api/Home';
// import RegisterController from '../controllers/Api/Auth/Register';
// import RefreshTokenController from '../controllers/Api/Auth/RefreshToken';

 const router = Router();

// router.get('/', HomeController.index);

router.post('/auth/login', UserRequest.validateLogin,AuthController.login);
router.post('/auth/register',UserRequest.validateRegister,AuthController.register);
router.post('/requestpasswordreset',UserRequest.validatePasswordResetRequest, AuthController.requestPasswordReset);
router.post('/resetpassword', UserRequest.validatePasswordReset,AuthController.resetPassword);

// router.post('/auth/refresh-token', expressJwt({ secret: Locals.config().appSecret }), RefreshTokenController.perform);

router.use('/users',userRouter);
router.get('/test', (req, res)=> res.render('pages/test'))

export default router;