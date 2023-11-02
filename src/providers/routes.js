const express = require('express');
const Locals = require('./locals');
const Log = require('../middlewares/log');

// const webRouter = require('./../routes/Web');
const apiRouter = require('../routes/api');

class Routes {
	// public mountWeb(_express: Application): Application {
	// 	Log.info('Routes :: Mounting Web Routes...');

	// 	return _express.use('/', webRouter);
	// }

	mountApi(_express){
		const apiPrefix = Locals.config().apiPrefix;
		Log.info('Routes :: Mounting API Routes...');

		return _express.use(`/${apiPrefix}`, apiRouter);
	}
}

module.exports = new Routes;