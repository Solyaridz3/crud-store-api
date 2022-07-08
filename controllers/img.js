const {getFileStream} = require('../controllers/s3');

const getImg = async (req, res) => {
    const key = req.params.key;
    const readStream = await getFileStream(key);
    readStream.pipe(res)
}

module.exports = {getImg};