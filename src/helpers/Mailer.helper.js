import nodemailer from 'nodemailer';
import Locals from '../providers/locals.js';
import ejs from 'ejs'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default new class Emailer {
	_transporter = nodemailer.createTransport({
		host: Locals.config().mailHost,
        port: Locals.config().mailPort,
        secure:true,
		auth: {
			user: Locals.config().mailAuthEmail,
			pass: Locals.config().mailAuthPassword,
		},
	})

	constructor() {}
	/**
	 * Sends an email to the intended recipient.
	 * @param {string} to - The recipient or recipient array for the email
	 * @param {string} sub - The subject of the email
	 * @param {string} body - The body of the email
	 */
	sendMail(to, sub, body_text = null,body_html=null, attachment) {
        console.log(Locals.config().mailHost)
		let selectedAttachment = [];
		// check if attachment is an array;
		if(attachment){
			if(Array.isArray(attachment)){
				selectedAttachment = attachment;
			}else{
				selectedAttachment.push(attachment);
			}
		}
		
		let mailOptions = {
			to: to,
			from: Locals.config().mailAuthEmail,
			subject: sub,
			text: body_text,
			html: body_html,
			attachments:selectedAttachment,
		}

		return this._transporter.sendMail(mailOptions)

	}

	/**
	 * @description Returns a compiled html string with the interpolated template options
	 * @param {string} templateName Name of the template relative to the template engine views folder
	 * @param {object} templateOptions The options that should be interpolated in the template
	 * @returns 
	 */
	compileTemplate(templateName, templateOptions={}){
		let templatePath = path.join(__dirname, "../templates", templateName);
		let fileExists = fs.existsSync(templatePath);
		if(!fileExists){
			throw new Error("File does not exist")
		}
		let html = ejs.compile(fs.readFileSync(templatePath,'utf8'));
		return html(templateOptions);
	}
}
