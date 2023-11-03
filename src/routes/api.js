import { Router } from 'express';
// import expressJwt from 'express-jwt';
import AuthController from '../controllers/api/auth.controller.js';
import UserController from '../controllers/api/user.controller.js';


// import HomeController from '../controllers/Api/Home';
// import RegisterController from '../controllers/Api/Auth/Register';
// import RefreshTokenController from '../controllers/Api/Auth/RefreshToken';

 const router = Router();

// router.get('/', HomeController.index);

router.post('/auth/login', AuthController.ValidateAndLogin());
router.post('/auth/register', AuthController.ValidateAndRegister());
// router.post('/auth/refresh-token', expressJwt({ secret: Locals.config().appSecret }), RefreshTokenController.perform);

router.get('/users', UserController.getAllUsers);

export default router;