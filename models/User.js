const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        maxLength: 50,
        minLength: 2,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        required: [true, 'Please provide your email']
    },
    password: {
        type: String,
        minLength: [8, 'Your password is too short'],
        required: [true, 'Please provide your password']
    }
})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {userId: this._id, name: this.name},
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        }
    );
}

UserSchema.methods.comparePasswords = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}


module.exports = mongoose.model('User', UserSchema);