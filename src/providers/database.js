const mongoose = require('mongoose');
const Locals = require('./locals');
const Log = require('../middlewares/log');

class Database {
	// Initialize your database pool
	static init () {
		const dsn = Locals.config().mongooseUrl;
		mongoose.connect(dsn)
			.then(() => {
			console.log('connected to mongo Atlas Server');
            Log.info('connected to mongo server');
		}).catch((error) => {
				console.log('Failed to connect to the Mongo server!!');
				Log.info('Failed to connect to the Mongo server!!');
				console.log(error);
				throw error;
		});
	}
}

module.exports = Database;
