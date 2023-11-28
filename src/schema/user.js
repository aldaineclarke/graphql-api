import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import log from '../middlewares/log.js';


export const userStatusMap = new Map([
	[0, 'INACTIVE'],
	[1, 'ACTIVE'],
	[2, 'DELETED'],
]);

export const userRoleMap = new Map([
	[0, 'USER'],
	[1, 'ADMIN'],
]);

export const userGenderMap = new Map([
	[0, 'MALE'],
	[1, 'FEMALE'],
])


let userSchemaMethods = {
	/**
	 * Parse the User document changing the data to a more readable and easy to use form. Remove password and other fields that need to be hidden
	 * @returns 
	 */
	parseUserData(){
		try{
			let status = userStatusMap.get(this.status);
			let role = userRoleMap.get(this.role_id);
			this.role_id = undefined;
			this.password = undefined;
			this.isDeleted = undefined;
			let gender = userGenderMap.get(this.gender);
			let parsedUser = {
				...this._doc,
				role,
				status,
				gender
			}
			return parsedUser;
		}catch(error){
			log(error);
		}
	},

	/**
	 * Compares the string passed in to the decrypted password of the user document.
	 * @param {string} _requestPassword 
	 * @returns 
	 */
	async comparePassword(_requestPassword){
	try{
		return await bcrypt.compare(_requestPassword, this.password);
	}catch(error){
		throw new Error('Unable to compare passwords');
	}
	},

	/**
	 * Checks user for duplicates using the email property of the user document.
	 * @param {mongoose.Model} _user 
	 * @returns 
	 */
	async checkDuplicates(_user){
	try{
		let existingUser = await User.findOne({email: _user.email.toLowerCase()})
		if(existingUser){
			return true;
		}
		return false;
	}catch(e){
		throw new Error('Unable to query User Table to check duplicates');
	}

},
} 


// Define the User Schema
const UserSchema = new mongoose.Schema({
	first_name: {type:String, required:[true, 'Firstname is a required field']},
	last_name: {type: String, required: [true, 'Lastname is a required field']},
    username: { type: String, required:[true, 'Username is a required field'] },
	email: { type: String, unique: true, validate: {
		validator: function(value){
			return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
		},
		message: (prop) => `${prop.value} is not a valid email address`
	}},
	gender: {type: Number, enum: Array.from(userGenderMap.keys()), default: 0},
	password: { type: String },
	role_id: {type: Number, enum: Array.from(userRoleMap.keys()), default: 0},
	passwordResetToken: { type: String },
	passwordResetExpires: {type:Date},	
	provider: {type: String, enum: {values:["google", "facebook", "twitter", "apple"], message: '{VALUE} is not a valid provider name'}},
	access_token: {
		type: String, 
		required:function(){
			return !!this.provider // this will check if provider is present. if it is then an access_token is needed
		}
	},
	status: { type: Number, enum: Array.from(userStatusMap.keys()), default: 0 },
	isDeleted: {type:Boolean, default:false}

}, {
	timestamps: true,
	methods:userSchemaMethods, // custom methods for the user instance document.
	statics: userSchemaStaticMethods,
	
	
});

// Password hash middleware
UserSchema.pre('save', async function(_next){
	const user = this;
	if(user){
		if (!user.isModified('password')) {
			return _next();
		}
	}
	
	try{
		let hashedPassword = await bcrypt.hash(user.password,10);
			user.password = hashedPassword;
			return _next();
	}catch(error){
		return _next(error);
	}
});

// Custom Methods







export const User = mongoose.model('User', UserSchema);
