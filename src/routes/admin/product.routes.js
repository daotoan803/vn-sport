const express = require('express');

const adminProductController = require('../../controllers/admin/product.controller');
const productValidator = require('../../middlewares/validations/product.validator');
const productMiddleware = require('../../middlewares/product.middleware');
const categoryBrandController = require('../../controllers/admin/category_brand.controller');

const uploadHandler = require('../../middlewares/upload-handler');

const routes = express.Router();

/*------------------------------------------------------*/
/*--------------------/api/admin/products-----------------------*/
/*------------------------------------------------------*/

routes.post('/is-title-unique', adminProductController.responseIsTitleUnique);

routes.post(
  '/:productId/images',
  uploadHandler.handleMultipleImagesUpload,
  productMiddleware.getProductById,
  adminProductController.addProductImages
);

routes.post(
  '/',
  uploadHandler.handleMultipleImagesUpload,
  productValidator.validateAddProductData,
  productValidator.checkIfProductTitleAlreadyExists,
  productMiddleware.findBrandAndCategory,
  adminProductController.createProduct,
  categoryBrandController.addBrandToCategory
);

module.exports = routes;
