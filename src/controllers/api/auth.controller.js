/**
 * Define Login Login for the API
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

const jwt = require('jsonwebtoken');
const { ValidationChain, body, validationResult } = require('express-validator');
const User = require('../../schema/user');
const { JsonResponse } = require('../../helpers/JsonResponse.helper');
const HttpStatusCode = require('../../helpers/StatusCodes.helper');

class AuthController {
    static loginValidations = [
        body("email", "Email cannot be blank").notEmpty(),
        body('email', 'Email is not valid').isEmail(),
        body('password', 'Password cannot be blank').notEmpty(),
        body('password', 'Password length must be atleast 8 characters').isLength({ min: 8 })
    ];
    static registerValidations = [
        body('email', 'E-mail cannot be blank').notEmpty(),
		body('email', 'E-mail is not valid').isEmail(),
		body('password', 'Password cannot be blank').notEmpty(),
		body('password', 'Password length must be atleast 8 characters').isLength({ min: 8 }),
		body('confirmPassword', 'Confirmation Password cannot be blank').notEmpty(),
    ];


	static ValidateAndLogin = () =>{

        return async (req, res, next)=>{
            try{
                await Promise.all(this.loginValidations.map(validation => validation.run(req)))
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return JsonResponse.error(res,"Invalid data fields", errors.array());

                }

                const _email = req.body.email.toLowerCase();
                const _password = req.body.password;

                let user = await User.findOne({email: _email});
                if (!user) {
                    return JsonResponse.error(res, "No matching records found", ["User does not exist in database"], HttpStatusCode.NOT_FOUND)
                }
                else{
                    if (! user.password) {
                        return JsonResponse.error(res, "Please enter password", ['Please login using your social creds']);
                    }
        
                        user.comparePassword(_password, (err, isMatch) => {
                            if (err) {
                                return JsonResponse.error(res, "Invalid credentitals", [err]);
                            }
        
                            if (! isMatch) {
                                return JsonResponse.error(res, "Invalid credentials try again", ["Passwords do not match"]);
                            }
                            const token = jwt.sign(
                                { email: _email, id: user?.id },
                                res.locals.app.appSecret,
                                { expiresIn: res.locals.app.jwtExpiresIn * 60 }
                            );
        
                            // Hide protected columns
                            delete user.password;
                            delete user.tokens;
        
        
        
                            return JsonResponse.success(res,"Login Successfully", {user:newObj, token, token_expires_in: res.locals.app.jwtExpiresIn * 60});
                        });
                    }   
            }catch(err){
                return JsonResponse.error(res, "Something happenned, try again", [err],HttpStatusCode.INTERNAL_SERVER_ERROR)
            }
        }  
    }
    static ValidateAndRegister = () =>{
        return async (req, res)=> {
            // need to find a better place to put this
            // this.registerValidations.push(body('confirmPassword', 'Password & Confirmation password does not match').equals(req.body.password));
            let registerValidations = [
                body('email', 'E-mail cannot be blank').notEmpty(),
                body('email', 'E-mail is not valid').isEmail(),
                body('username', 'Username cannot be blank').notEmpty(),
                body('password', 'Password cannot be blank').notEmpty(),
                body('password', 'Password length must be atleast 8 characters').isLength({ min: 8 }),
                body('confirmPassword', 'Confirmation Password cannot be blank').notEmpty(),
                body('confirmPassword', 'Password & Confirmation password does not match').equals(req.body.password)
            ]
            await Promise.all(registerValidations.map(validation => validation.run(req)))


		const errors = validationResult(req);
		if (!errors.isEmpty()) {
            return JsonResponse.error(res,"Invalid data fields", errors.array());
		}

		const _email = req.body.email.toLowerCase();
		const _password = req.body.password;

		const newUser = new User({
			email: _email,
			password: _password
		});
        try{
            let existingUser = await User.findOne({ email: _email });
            if(existingUser){
                return JsonResponse.error(res, "Account with the e-mail address already exists");
            }else{
              let userData = await newUser.save(); 
              return JsonResponse.success(res,"User registered successfully", userData );
            }

        }catch(err){
            return JsonResponse.error(res, "Something happenned, try again", [err],HttpStatusCode.INTERNAL_SERVER_ERROR)

        }
			
    }
    }   
}

module.exports = AuthController;