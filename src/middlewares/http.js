/**
 * Defines all the requisites in HTTP
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// import cors from 'cors';
// import connect from 'connect-mongo';
import session from 'express-session';
import Log from '../middlewares/log.js';
import Locals from '../providers/locals.js';
import Passport from '../providers/passport.js';
import express from 'express';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Http {
	static mount(_express) {
		Log.info('Booting the \'HTTP\' middleware...');

		// Enables the request body parser
		_express.use(express.json({
			limit: Locals.config().maxUploadLimit
		}));
		_express.use(express.urlencoded({
			limit: Locals.config().maxUploadLimit,
			parameterLimit: Locals.config().maxParameterLimit,
			extended: true
		}));
		// // Allow files to be uploaded and access through the formdata/multipart content type
		_express.use(fileUpload());

		// Allow the use of templates to be returned from the API with the render method.
		_express.set('view engine', 'ejs')
		_express.set('views', path.join(__dirname, '../templates'))

		
		// Added middleware to expose appconfig to all requests
		_express.use((req, res, next)=> {
			res.locals.app = _express.locals.app;
			res.locals.meet = "string";
			next()
		})

		// Disable the x-powered-by header in response
		_express.disable('X-Powered-By');

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
