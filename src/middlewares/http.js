/**
 * Defines all the requisites in HTTP
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

const cors = require('cors');
// const connect = require('connect-mongo');
const bodyParser = require('body-parser');
const session = require('express-session');
const Log = require('../middlewares/log');
const Locals = require('../providers/locals');
const Passport = require('../providers/passport');

class Http {
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

module.exports = Http;