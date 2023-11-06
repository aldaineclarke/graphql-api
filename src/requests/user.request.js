import expressValidator from 'express-validator'
import { User } from '../schema/user.js';
import JsonResponse from '../helpers/JsonResponse.helper.js';
const { body, validationResult } = expressValidator;

export default class UserRequest{
    static createUserValidator = [
        body('first_name', 'Firstname cannot be blank').notEmpty(),
        body('last_name', 'Lastname cannot be blank').notEmpty(),
        body('username', 'username cannot be blank').notEmpty(),
        body('email', 'Email cannot be blank').notEmpty(),
        body('password', 'Password cannot be blank').notEmpty(),
        body('confirmPassword', 'Confirmation Password cannot be blank').notEmpty(),
        body('gender', 'Gender cannot be blank').notEmpty(),
        body('gender', 'Gender value is not valid').isNumeric(),
        body('email', 'Email is not valid').isEmail(),
        // body('email').custom(async value => {
        //     const user = await User.findOne({email: value.toLowerCase()});
        //     if (user) {
        //       throw new Error('E-mail already in use');
        //     }
        //   }),
        
        body('password', 'Password must be eight characters including one uppercase letter, one special character and alphanumeric characters').matches(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
        body('confirmPassword', 'Confirmation Password cannot be blank').notEmpty(),
        body('confirmPassword', 'Password & Confirmation password does not match').custom((value, {req})=>{
            return value === req.body.password;
        }),
    ];

    static loginValidation =[
        body('email', 'Email cannot be blank').notEmpty(),
        body('email', 'Email is not valid').isEmail(),
        body('password', 'Password cannot be blank').notEmpty(),
        body('password', 'Password length must be atleast 8 characters').isLength({ min: 8 }),
    ];
    static async _validateMiddleware(req, res, next, validationArr ){
        for (let validation of validationArr) {
          const result = await validation.run(req);
          if (result.errors.length) break;
        }
    
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          return next();
        }
        return JsonResponse.error(res,"Invalid data fields", errors.array());
    };


    static validateLogin = async(req, res, next) =>{
        return this._validateMiddleware(req, res, next, this.loginValidation)
    }
    static validateRegister = async(req, res, next)=>{
        return await this._validateMiddleware(req, res, next, this.createUserValidator)
    }



}