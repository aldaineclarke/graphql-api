

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
// Define the User Schema
const UserSchema = new mongoose.Schema({
	first_name: {type:String, required:[true, 'Firstname is a required field']},
	last_name: {type: String, required: [true, 'Lastname is a required field']},
    username: { type: String, required:[true, 'Username is a required field'] },
	email: { type: String, unique: true },
	password: { type: String },
	role_id: {type: Number},
	passwordResetToken: { type: String },
	passwordResetExpires: {type:Date},	
	status: { type: Number, enum: Object.keys(userStatusMap), default: 0 },

}, {
	timestamps: true
});

// Password hash middleware
UserSchema.pre('save', async (_next)=>{
	const user = this;
	if (!user.isModified('password')) {
		return _next();
	}
	try{
		let hashedPassword = await bcrypt.hash(user.password, _salt);
			user.password = hashedPassword;
			return _next();
	}catch(error){
		return _next(error);
	}
});

// Custom Methods
// Compares the user's password with the request password
UserSchema.methods.comparePassword = async(_requestPassword)=>{
	try{
		return await bcrypt.compare(_requestPassword, this.password);
	}catch(error){
		log.error('Unable to compare passwords');
		throw new Error('Unable to compare passwords');

	}
};

//Checks user for duplicates
UserSchema.methods.checkDuplicates = async(_user)=>{
	try{
		let existingUser = await User.findOne({email: _user.email})
		if(existingUser){
			return true;
		}
		return false;
	}catch(e){
		log.error('Unable to query User Table to check duplicates');
		throw new Error('Unable to query User Table to check duplicates');
	}
}

export const User = mongoose.model('User', UserSchema);
