const User = require('../models/User');
const {UnauthenticatedError} = require('../errors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: payload.userId, name: payload.name};
    }catch (err){
        throw new UnauthenticatedError('Authentication invalid2');
    }
    next();
}

module.exports = auth;