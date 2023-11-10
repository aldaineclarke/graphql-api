/**
 * Define Login Login for the API
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import jwt from 'jsonwebtoken';
import log from '../../middlewares/log.js';
import {User} from '../../schema/user.js';
import JsonResponse from '../../helpers/JsonResponse.helper.js';
import HttpStatusCode from '../../helpers/StatusCodes.helper.js';

export default class AuthController {

	static async login (req, res, next){
            try{
                const _email = req.body.email.toLowerCase();
                const _password = req.body.password;

                let user = await User.findOne({email: _email});
                if (!user) {
                    return JsonResponse.error(res, "No matching records found", ["User does not exist in database"], HttpStatusCode.NOT_FOUND)
                }

                if (! user.password) {
                    return JsonResponse.error(res, "Please enter password", ['Please login using your social creds']);
                }
                let isCorrectPassword = await user.comparePassword(_password);
                if(!isCorrectPassword){
                    return JsonResponse.error(res, "Invalid credentials try again", ["Passwords do not match"]);
                }

                const token = jwt.sign(
                    { email: _email, id: user?.id, role_id: user.role_id },
                        res.locals.app.appSecret,
                    { expiresIn: res.locals.app.jwtExpiresIn * 60 }
                );
                    // Hide protected columns
                let parsedUser = user.parseUserData();

                return JsonResponse.success(res,"Login Successfully", {user:parsedUser, token, token_expires_in: res.locals.app.jwtExpiresIn * 60});


            }catch(err){
               next(err)
            }
         
    }
    static async register (req, res, next){
		const _email = req.body.email.toLowerCase();

		const newUser = new User({
            ...req.body,
			email: _email, // overrides the value email to be its lowecase equivalent
		});
        try{
            let existingUser = await User.findOne({ email: _email });
            if(existingUser){
                return JsonResponse.error(res, "Account with the e-mail address already exists");
            }else{
              let userData = (await newUser.save()).parseUserData(); 
              return JsonResponse.success(res,"User registered successfully", userData );
            }

        }catch(err){
            next(err)
         }
			
    }
}

