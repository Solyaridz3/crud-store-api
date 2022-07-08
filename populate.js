require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProduct = require('./products.json');
jsonProduct.map(el=>el.createdBy=process.env.POPULATE_CREATED_BY);
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(jsonProduct)
        console.log('SUCCESSFULLY CREATED')
        process.exit(0)
    } catch (err) {
        console.log(err)
    }
}

start()