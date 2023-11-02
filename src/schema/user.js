

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const userStatusMap = new Map([
	[0, 'Inactive'],
	[1, 'Active'],
])
// Define the User Schema
const UserSchema = new mongoose.Schema({
	email: { type: String, unique: true },
	password: { type: String },
	passwordResetToken: { type: String },
	passwordResetExpires: Date,	
    username: { type: String },
	status: { type: Number, enum: Object.keys(userStatusMap), default: 0 },
	points: { type: Number, default:0 }
}, {
	timestamps: true
});

// Password hash middleware
UserSchema.pre('save', function (_next) {
	const user = this;
	if (!user.isModified('password')) {
		return _next();
	}

	bcrypt.genSalt(10, (_err, _salt) => {
		if (_err) {
			return _next(_err);
		}

		bcrypt.hash(user.password, _salt).then((_hash) => {
			user.password = _hash;
			return _next();
		}).catch((_err)=>{
            if (_err) {
				return _next(_err);
			}

        });
	});
});

// Custom Methods
// Compares the user's password with the request password
UserSchema.methods.comparePassword = function (_requestPassword, _cb) {
	bcrypt.compare(_requestPassword, this.password, (_err, _isMatch) => {
		return _cb(_err, _isMatch);
	});
};

module.exports.User = mongoose.model('User', UserSchema);
