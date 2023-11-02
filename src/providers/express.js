
const express = require('express');
const Locals = require('./locals');
const Routes = require('./routes');
const Bootstrap = require('../middlewares/kernel');
const ExceptionHandler = require('../exception/handler');

class Express {
	/**
	 * Create the express object
	 */

	/**
	 * Initializes the express server
	 */
	constructor () {
		this.express = express();

		this.mountDotEnv();
		this.mountMiddlewares();
		this.mountRoutes();
	}

	mountDotEnv (){
		this.express = Locals.init(this.express);
	}

	/**
	 * Mounts all the defined middlewares
	 */
	mountMiddlewares () {
		this.express = Bootstrap.init(this.express);
	}

	/**
	 * Mounts all the defined routes
	 */
	mountRoutes () {
		// this.express = Routes.mountWeb(this.express);
		this.express = Routes.mountApi(this.express);
	}

	/**
	 * Starts the express server
	 */
	init () {
		const port = Locals.config().port;

		// Registering Exception / Error Handlers
		this.express.use(ExceptionHandler.logErrors);
		this.express.use(ExceptionHandler.clientErrorHandler);
		this.express.use(ExceptionHandler.errorHandler);
		this.express = ExceptionHandler.notFoundHandler(this.express);
		// Mount the socket server to the expreses application.
		// Start the server on the specified port
		this.express.listen(port, () => {
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		}).on('error', (_error) => {
			return console.log('Error: ', _error.message);
		});
	}
}

/** Export the express module */
module.exports = new Express();