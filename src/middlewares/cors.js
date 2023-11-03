/**
 * Enables the CORS
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import cors from 'cors';
import Locals from '../providers/locals.js';
import Log from '../middlewares/log.js';
export default new class CORS {

	
	mount(_express){
		Log.info('Booting the \'CORS\' middleware...');

		const options = {
			origin: Locals.config().url,
			optionsSuccessStatus: 200		// Some legacy browsers choke on 204
		};

		_express.use(cors(options));

		return _express;
	}
}

