/**
 * Define Login Login for the API
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import jwt from 'jsonwebtoken';
import { User } from '../../schema/user.js';
import JsonResponse from '../../helpers/JsonResponse.helper.js';
import HttpStatusCode from '../../helpers/StatusCodes.helper.js';
import { EncryptionService } from '../../helpers/Encryption.helper.js';
import Mailer from '../../helpers/Mailer.helper.js';

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

    static async requestPasswordReset (req, res, next){
        let email = req.body.email;
        // this should be taken care of in in the express validator for user request.
        if(!email){
            return JsonResponse.error(res, "No email provided", ["No email provided to request password reset"])
        }
        let _email = email.toLowerCase();
        try{
            let user = await User.findOne({email:_email});
            if(!user){
                return JsonResponse.error(res, "No matching records found", ["Email does not match any accounts"])
            }
            // generate a token then send said token to the user via password reset template. 
            let enc = EncryptionService.set({id: user.id, email:user.email});
            user.passwordResetToken = enc;
            // sets the token expires time to 24 hours away from right now.
            user.passwordResetExpires = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)); 
            // This will be the url that is sent in the email template to the user.
            let url = 'http://localhost:4200/password-reset/'+enc;
            
            let compiledHtml =  Mailer.compileTemplate("emails/password-reset.ejs", {user:{name:user.first_name +" "+ user.last_name}, url:url})
            Mailer.sendMail("aldaineclarke1@gmail.com", "Password Reset",null,compiledHtml)
            return JsonResponse.success(res, "Successfully Requested Password Reset", {token: enc});


        }catch(err){
            next(err);
        }
    }

    static async resetPassword(req, res, next){
        let token = req.body.token; // token from the password reset request sent to the user.
        let password = req.body.password;

        // Decrypt token sent from the requestpasswordreset endpoint
        let tokenObj = JSON.parse(JSON.parse(EncryptionService.get(token)));

        try{
            let user = await User.findById(tokenObj.id).where({isDeleted: {$ne : true}});
            if(!user ){
                return JsonResponse.error(res, "No matching records found");
            }
            if(!user.passwordResetExpires < new Date()){
                return JsonResponse(res, "Password reset attempt failed", ["Reset request has expired. Try again later"])
            }
            if(!user.passwordResetToken){
                return JsonResponse.error(res, "Password reset attempt failed", ["No request to reset password was made. Try again later"])
            }
            user.password = password;
            user.passwordResetToken = null,
            user.passwordResetExpires = null,
            await user.save();
            return JsonResponse.success(res, "Password reset was successful");
        }catch(err){
            next(err)
        }


    }

    static async verifyOtp(req, res, next){
        let otp = req.body.otp;



    }
}

