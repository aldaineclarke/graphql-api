/**
 * Primary file for your Clustered API Server
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// import kue from 'kue';
const path = require('path');
const dotenv = require('dotenv');
const Log = require('../middlewares/log');

const Express = require('./express');
const Database = require('./database');
class App {
	// Clear the console
	clearConsole () {
		process.stdout.write('\x1B[2J\x1B[0f');
	}

	// Loads your dotenv file
	loadConfiguration () {
		Log.info('Configuration :: Booting @ Master...');

		dotenv.config({ path: path.join(__dirname, '../../.env') });
	}

	// Loads your Server
	loadServer () {
		Log.info('Server :: Booting @ Master...');

		Express.init();
	}

	// Loads the Database Pool
	loadDatabase () {
		Log.info('Database :: Booting @ Master...');

		Database.init();
	}

	// Loads the Worker Cluster
	loadWorker () {
		Log.info('Worker :: Booting @ Master...');
	}
}

module.exports = new App();