/**
 * Creates & maintains the log
 */

import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const __dirname = new URL('.', import.meta.url).pathname.slice(1);

export default new class Log {
	baseDir;
	fileName;
	linePrefix;

	today = new Date();

	constructor() {
		let _dateString = `${this.today.getFullYear()}-${(this.today.getMonth() + 1)}-${this.today.getDate()}`;
		let _timeString = `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`;

		this.baseDir = path.join(__dirname, '../../.logs/');

		this.fileName = `${_dateString}.log`;
		this.linePrefix = `[${_dateString} ${_timeString}]`;
	}

	/**
	 * Creates an entry in the log file.
	 * This entry is used to inform the user of some information.
	 * Level 1 log
	 * @param {string} _string 
	 */
info (_string) {
		this.addLog('INFO', _string);
	}

	/**
	 * Creates an entry in the log file.
	 * This entry is used to warn user of a potential failure in the application.
	 * Level 2 log
	 */
warn (_string) {
		this.addLog('WARN', _string);
	}

	/**
	 * Creates an entry in the log file.
	 * This entry is used to inform the user that the application was unable to perform an operation due to an error.
	 * Level 3 log
	 */
error (_string) {
		// Line break and show the first line
		if(typeof _string != 'string'){
			_string = _string.message ?? "Unable to get error message from error object";
		}
		console.log('\x1b[31m%s\x1b[0m', '[ERROR] :: ' + _string.split(/r?\n/)[0]);

		this.addLog('ERROR', _string);
	}
	/**
	 * Creates a entry in the log file for a custom log type.
	 * @param {string} _logName 
	 * @param {string} _string 
	 */
	// Adds the custom prefix string to the log string
custom (_logName, _string) {
		this.addLog(_logName, _string);
	}

	/**
	 * Creates the file if does not exist, and
	 * append the log kind & string into the file.
	 * @param {string} _kind
	 * @param {string} _message
	 */
addLog (_kind, _message) {
		const _that = this;
		_kind = _kind.toUpperCase();
		// creates baseDir if the path doesn't exist
		if(!fs.existsSync(_that.baseDir)){
			fs.mkdirSync(_that.baseDir);
		}
		// If unable to append file error shows. It means that there is no .logs folder in the project. 
		fs.open(`${_that.baseDir}${_that.fileName}`, 'a+', (_err, _fileDescriptor) => {
			if (!_err && _fileDescriptor) {
				// Append to file and close it
				fs.appendFile(_fileDescriptor, `${_that.linePrefix} [${_kind}] ${_message}\n`, (_err) => {
					if (! _err) {
						fs.close(_fileDescriptor, (_err) => {
							if (! _err) {
								return true;
							} else {
								return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended');
							}
						});
					} else {
						return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file');
					}
				});
			} else {
				return console.log('\x1b[31m%s\x1b[0m', 'Error cloudn\'t open the log file for appending');
			}
		});
	}
}
