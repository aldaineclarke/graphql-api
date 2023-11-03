/**
 * Defines all the requisites in HTTP
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// import cors from 'cors';
// import connect from 'connect-mongo';
import bodyParser from 'body-parser';
import session from 'express-session';
import Log from '../middlewares/log.js';
import Locals from '../providers/locals.js';
import Passport from '../providers/passport.js';

export default class Http {
	static mount(_express) {
		Log.info('Booting the \'HTTP\' middleware...');

		// Enables the request body parser
		_express.use(bodyParser.json({
			limit: Locals.config().maxUploadLimit
		}));
		_express.use(bodyParser.urlencoded({
			limit: Locals.config().maxUploadLimit,
			parameterLimit: Locals.config().maxParameterLimit,
			extended: false
		}));
		// Added middleware to expose appconfig to all requests
		_express.use((req, res, next)=> {
			res.locals.app = _express.locals.app;
			res.locals.meet = "string";
			next()
		})

		// Disable the x-powered-by header in response
		_express.disable('x-powered-by');

		// Enables the request flash message
				/**
		 * Enables the session store
		 *
		 * Note: You can also add redis-store
		 * into the options object.
		 */
				const options = {
					resave: true,
					saveUninitialized: true,
					secret: Locals.config().appSecret,
					cookie: {
						maxAge: 1209600000 // two weeks (in ms)
					},
					// store: new MongoStore({
					// 	url: process.env.MONGOOSE_URL,
					// 	autoReconnect: true
					// })
				};
		
				_express.use(session(options));

		// Loads the passport configuration
		_express = Passport.mountPackage(_express);

		return _express;
	}
}
