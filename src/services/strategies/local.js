/**
 * Define passport's local strategy
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import { Strategy } from 'passport-local';
import {User} from '../../schema/user.js';
import Log from '../../middlewares/log.js';

export default class Local {
	static init (_passport){
		_passport.use(new Strategy({ usernameField: 'email' }, async (email, password, done) => {
			Log.info(`Email is ${email}`);
			Log.info(`Password is ${password}`);
			try{

				let user = await User.findOne({ email: email.toLowerCase() });

				if(!user){
					return done(null, false, { message: `E-mail ${email} not found.`});
				}else if (user && !user.password) {
					// This case is for social login options.
					return done(null, false, { message: `E-mail ${email} was not registered with us using any password. Please use the appropriate providers to Log-In again!`});
				}else{
					Log.info(`user is ${user.email}`);
					Log.info('comparing password now!');

					let passwordMatched = await user.comparePassword(password)
					if (!passwordMatched) {
						return done(_err);
					}
					return done(null, user); 
					
				}
				

			}catch(err){
				return done(err);
			}
		}
	));
	}
}