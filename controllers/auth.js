const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {UnauthenticatedError, BadRequestError} = require("../errors");

const login = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({email});
    if (!user){
        throw new UnauthenticatedError('Invalid credentials');
    }
    const isPasswordCorrect = user.comparePasswords(password);
    if (!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid credentials');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name: user.name, userId: user._id},token});
}

const register = async (req, res) => {
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name}, token});
}


module.exports = {
    login,
    register,
}