const express = require('express');
const router = express.Router();
const uploadCloud = require('../middleware/uploadCloud');
const productController = require('../controllers/productController');

// Tạo mới
router.post(
    '/',
    uploadCloud.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 10 }
    ]),
    productController.createProduct
);
router.get('/rent', productController.getProductsForRent);
router.get('/sale', productController.getProductsForSale);
router.get('/project/:projectId/sale', productController.getProjectWithSaleProducts);
router.get('/filter', productController.filterProducts);
router.get('/project/:projectId', productController.getProductsByProject);
router.get('/type/:type', productController.getProductsByType);
router.get('/name/:name', productController.getProductByName);
// routes/product.js
router.delete('/:id/subimage', productController.deleteSubImage);
router.get('/advanced-filter', productController.advancedFilterProducts);


// Lấy tất cả
router.get('/', productController.getProducts);

// Lấy 1 theo id
router.get('/:id', productController.getProductById);

// Sửa
router.put(
    '/:id',
    uploadCloud.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 10 }
    ]),
    productController.updateProduct
);

// Xóa
router.delete('/:id', productController.deleteProduct);

module.exports = router;
