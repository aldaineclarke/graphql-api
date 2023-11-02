const { Router } = require('express');
// const expressJwt = require('express-jwt');

const Locals = require('../providers/locals');
const AuthController = require('../controllers/api/auth.controller');
const UserController = require('../controllers/api/user.controller');


// const HomeController = require('../controllers/Api/Home');
// const RegisterController = require('../controllers/Api/Auth/Register');
// const RefreshTokenController = require('../controllers/Api/Auth/RefreshToken');

const router = Router();

// router.get('/', HomeController.index);

router.post('/auth/login', AuthController.ValidateAndLogin());
router.post('/auth/register', AuthController.ValidateAndRegister());
// router.post('/auth/refresh-token', expressJwt({ secret: Locals.config().appSecret }), RefreshTokenController.perform);

router.get('/users', UserController.getAllUsers);

module.exports = router;