/**
 * Primary file for your Clustered API Server
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// import kue from 'kue';
import path from 'path';
import dotenv from 'dotenv';
import Log from '../middlewares/log.js';

import Express from './express.js';
import Database from './database.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default new class App {
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
