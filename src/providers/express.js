
import express from 'express';
import Locals from './locals.js';
import Routes from './routes.js';
import Bootstrap from '../middlewares/kernel.js';
import ExceptionHandler from '../exception/handler.js';

export default new class Express {
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
		// Start the server on the specified port
		this.express.listen(port, () => {
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		}).on('error', (_error) => {
			return console.log('Error: ', _error.message);
		});
	}
}

