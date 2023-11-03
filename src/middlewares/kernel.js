/**
 * Register your Express middlewares
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import CORS from './cors.js';
import Http from './http.js';
import Locals from '../providers/locals.js';

export default class Kernel {
	static init (_express) {
		// Check if CORS is enabled
		if (Locals.config().isCORSEnabled) {
			// Mount CORS middleware
			_express = CORS.mount(_express);
		}

		// Mount basic express apis middleware
		_express = Http.mount(_express);

		// Mount csrf token verification middleware
		// _express = CsrfToken.mount(_express);

		// Mount view engine middleware
		// _express = Views.mount(_express);

		// Mount statics middleware
		// _express = Statics.mount(_express);

		// Mount status monitor middleware
		// _express = StatusMonitor.mount(_express);

		return _express;
	}
}
