import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default class Locals {
	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	static config() {
		dotenv.config({ path: path.join(__dirname, '../../.env') });

		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT || 4040;
		const appSecret = process.env.APP_SECRET || 'This is your responsibility!';
		const mongooseUrl = process.env.MONGOOSE_URL;
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '50mb';

		const name = process.env.APP_NAME || 'NodeTS Dashboard';
		const keywords = process.env.APP_KEYWORDS || 'somethings';
		const year = (new Date()).getFullYear();
		const copyright = `Copyright ${year} ${name} | All Rights Reserved`;
		const company = process.env.COMPANY_NAME || 'GeekyAnts';
		const description = process.env.APP_DESCRIPTION || 'Here goes the app description';

		const isCORSEnabled = (process.env.CORS_ENABLED == false) ? false : true;
		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;
		const apiPrefix = process.env.API_PREFIX || 'api';

		const logDays = process.env.LOG_DAYS || 10;

		const queueMonitor = process.env.QUEUE_HTTP_ENABLED || true;
		const queueMonitorHttpPort = process.env.QUEUE_HTTP_PORT || 5550;

		const redisHttpPort = process.env.REDIS_QUEUE_PORT || 6379;
		const redisHttpHost = process.env.REDIS_QUEUE_HOST || '127.0.0.1';
		const redisPrefix = process.env.REDIS_QUEUE_DB || 'q';
		const redisDB = process.env.REDIS_QUEUE_PREFIX || 3;

		const amzS3Region = process.env.AMZ_S3_REGION || ""
		const amzS3Bucket = process.env.AMZ_S3_BUCKET || ""
		const amzS3SecretKey = process.env.AMZ_S3_SECRET_KEY || ""
		const amzS3AccessKey = process.env.AMZ_S3_ACCESS_KEY || ""

		const mailHost = process.env.MAIL_HOST
		const mailPort = process.env.MAIL_PORT 
		const mailAuthPassword = process.env.MAIL_AUTH_PASSWORD
		const mailAuthEmail = process.env.MAIL_AUTH_EMAIL

		return {
			appSecret,
			apiPrefix,
			company,
			copyright,
			description,
			isCORSEnabled,
			jwtExpiresIn,
			keywords,
			logDays,
			maxUploadLimit,
			maxParameterLimit,
			mongooseUrl,
			name,
			port,
			redisDB,
			redisHttpPort,
			redisHttpHost,
			redisPrefix,
			url,
			queueMonitor,
			queueMonitorHttpPort,
			amzS3AccessKey,
			amzS3Bucket,
			amzS3Region,
			amzS3SecretKey,
			mailAuthEmail,
			mailAuthPassword,
			mailHost,
			mailPort
		};
	}

	/**
	 * Injects your config to the app's locals
	 */
	static init (_express){
		_express.locals.app = this.config();
		return _express;
	}
}