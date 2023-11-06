/**
 * Define the error & exception handlers
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import Locals from '../providers/locals.js';
import JsonResponse from '../helpers/JsonResponse.helper.js';
import HttpStatusCode from '../helpers/StatusCodes.helper.js';
import log from '../middlewares/log.js';

export default class Handler {
	/**
	 * Handles all the not found routes
	 */
	static notFoundHandler(_express) {
		const apiPrefix = Locals.config().apiPrefix;

		_express.use('*', (req, res) => {
			const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
			log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
			if (req.xhr || req.originalUrl.includes(`/${apiPrefix}/`)) {
				return JsonResponse.error(res, "Page Not Found",[], HttpStatusCode.NOT_FOUND)
			} else {
				res.status(404);
				return res.render('pages/error', {
					title: 'Page Not Found',
					error: []
				});
			}
		});

		return _express;
	}

	/**
	 * Handles your api/web routes errors/exception
	 */
	static clientErrorHandler(err, req, res, next) {
		log.error(err.stack);

		if (req.xhr) {
			return JsonResponse.error(res, "Something went wrong!", [], HttpStatusCode.INTERNAL_SERVER_ERROR);
		} else {
			return next(err);
		}
	}

	/**
	 * Show undermaintenance page incase of errors
	 */
	static errorHandler(err, req, res,next) {


		const apiPrefix = Locals.config().apiPrefix;
		if (req.originalUrl.includes(`/${apiPrefix}/`)) {

			if (err.name && err.name === 'UnauthorizedError') {
				const innerMessage = err.inner && err.inner.message ? err.inner.message : undefined;
				return JsonResponse.error(res, "Unauthorized access attempted", [innerMessage], HttpStatusCode.UNAUTHORIZED)
			}

			return JsonResponse.error(res, "An error occurred with the request", [err], HttpStatusCode.INTERNAL_SERVER_ERROR)
		}

		return res.render('pages/error', { error: err.stack, title: 'Under Maintenance' });
	}

	/**
	 * Register your error / exception monitoring
	 * tools right here ie. before "next(err)"!
	 */
	static logErrors(err, req, res, next) {
		log.error(err.stack);

		return next(err);
	}
}

