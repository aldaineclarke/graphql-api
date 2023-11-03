import mongoose from 'mongoose';
import Locals from './locals.js';
import Log from '../middlewares/log.js';

export default class Database {
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
