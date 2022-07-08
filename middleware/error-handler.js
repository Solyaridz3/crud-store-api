const {StatusCodes} = require('http-status-codes');
const errorHandlerMiddleware = async (err, req, res, next) => {
  const customError = {};
  customError.status = err.statusCode || 500;
  customError.message = err.message || 'Something went wrong';
  if (err.name === 'ValidationError'){
    customError.status = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(err.errors).map(item=>item.message).join(', ');
  }
  if (err.code === 11000){
    customError.status = StatusCodes.BAD_REQUEST;
    customError.message = `User with that ${Object.keys(err.keyValue)} is already exist`;
  }
  // return res.status(customError.status).json({err})
  return res.status(customError.status).json({msg:customError.message})
}

module.exports = errorHandlerMiddleware
