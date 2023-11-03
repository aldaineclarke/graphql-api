
import passport from 'passport';
import LocalStrategy from '../services/strategies/local.js';
import {User} from '../schema/user.js';

export default new class Passport {
	mountPackage (_express){
		_express = _express.use(passport.initialize());
		_express = _express.use(passport.session());

		passport.serializeUser((user, done) => {
			done(null, user.id);
		});

		passport.deserializeUser((id,done) => {
			User.findById(id, (err, user) => {
				done(err, user);
			});
		});

		this.mountLocalStrategies();

		return _express;
	}

	mountLocalStrategies() {
		try {
			LocalStrategy.init(passport);
			// GoogleStrategy.init(passport);
			// TwitterStrategy.init(passport);
		} catch (_err) {
			Log.error(_err.stack);
		}
	}

	// public isAuthenticated (req, res, next): any {
	// 	if (req.isAuthenticated()) {
	// 		return next();
	// 	}

	// 	req.flash('errors', { msg: 'Please Log-In to access any further!'});
	// 	return res.redirect('/login');
	// }

	// public isAuthorized (req, res, next): any {
	// 	const provider = req.path.split('/').slice(-1)[0];
	// 	const token = req.user.tokens.find(token => token.kind === provider);
	// 	if (token) {
	// 		return next();
	// 	} else {
	// 		return res.redirect(`/auth/${provider}`);
	// 	}
	// }
}
