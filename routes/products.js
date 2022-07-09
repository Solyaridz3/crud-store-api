const express = require('express');
const router = express.Router();

const {
    getAllProductsStatic,
    getAllProducts,
    getSingeProduct,
    createProduct,
    deleteProduct,
    updateProduct,
    getImg

} = require('../controllers/products');

const {upload} = require('../middleware/img-middleware');

router.route('/')
    .get(getAllProducts)
    .post(upload.single('image'), createProduct);

router.route('/:id')
    .get(getSingeProduct)
    .delete(deleteProduct)
    .patch(updateProduct);

router.route('/static').get(getAllProductsStatic);
router.route('/images/:key').get(getImg);

module.exports = router;