const Product = require('../models/product');
const {NotFoundError} = require('../errors');
const {StatusCodes} = require("http-status-codes");
const {BadRequestError} = require('../errors');
const {uploadFile, getFileStream} = require('../controllers/s3');
const util = require("util");
const fs = require("fs");
const unlinkFile = util.promisify(fs.unlink);


const getAllProductsStatic = async (req, res) => {
    const search = 'ab'
    const products = await Product
        .find({price: {$gt: 30, $lt: 50}})
        .select('name price')
    res.status(201).json({
        nbHits: products.length, data: products,
    })
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject = {}
    if (featured) {
        queryObject.featured = featured === 'true'
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt', '>=': '$gte', '=': '$eq', '<': '$lt', '<=': '$lte'
        }
        const regEx = /\b(>|>=|=|<=|<)\b/g
        let filters = numericFilters.replace(regEx, match => `-${operatorMap[match]}-`)
        const options = ['price', 'rating']
        filters = filters.split(',').map(item => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    let result = Product.find(queryObject)
    if (sort) {
        const sortString = sort.replace(',', ' ')
        result = result.sort(sortString)
    } else {
        result = result.sort('createdAt')
    }
    if (fields) {
        const selectString = fields.replace(',', ' ')
        result = result.select(selectString)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit)
    const products = await result

    res.status(201).json({
        nbHits: products.length, data: products,
    })
}

const getSingeProduct = async (req, res) => {
    const {id: jobId} = req.params;
    const product = await Product.findOne({_id: jobId});
    if (!product) {
        throw new NotFoundError(`No product found with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({product});
}

const createProduct = async (req, res) => {
    if (!req.file) {
        throw new BadRequestError('You should choose image');
    }
    const {userId} = req.user;
    const result = await uploadFile(req.file);
    req.body.imageKey = '/products/images/' + result.Key;
    req.body.createdBy = userId;
    const product = await Product.create(req.body);
    await unlinkFile(req.file.path);
    res.status(StatusCodes.OK).json({product});
}

const deleteProduct = async (req, res) => {
    const {
        user: {userId},
        params: {id: jobId}
    } = req;
    const deletedProduct = await Product.findOneAndDelete({_id: jobId, createdBy: userId});
    if (!deletedProduct) {
        throw new NotFoundError(`No product with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({deletedProduct});
}


const updateProduct = async (req, res) => {
    const {
        user: {userId},
        params: {id: jobId}
    } = req;
    if (req.file) {
        const result = await uploadFile(req.file);
        req.body.imageKey = '/products/images/' + result.Key;
    }
    const product = await Product.findOneAndUpdate({_id: jobId, createdBy: userId}, req.body,
        {new: true, runValidators: true});
    if (!product){
        throw new NotFoundError(`No product with id ${jobId}`);
    }
    if (req.file){
        await unlinkFile(req.file.path);
    }
    res.status(StatusCodes.OK).json({product});
}


module.exports = {
    getAllProductsStatic, getAllProducts, getSingeProduct, createProduct, deleteProduct, updateProduct
}
