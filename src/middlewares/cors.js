/**
 * Enables the CORS
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

const cors = require('cors');
const Locals = require('../providers/locals');
const Log = require('../middlewares/log');
class CORS {

	
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

module.exports = new CORS;