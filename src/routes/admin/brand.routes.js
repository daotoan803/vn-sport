const BrandController = require('../../controllers/brand.controller');
const brandValidator = require('../../middlewares/validations/brand.validator');
const uploadController = require('../../middlewares/upload-handler');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*-------------------- /api/admin/brands -----------------------*/
/*------------------------------------------------------*/

routes.post(
  '/',
  uploadController.handleSingleImageUpload,
  brandValidator.validateBrandData,
  brandValidator.checkIfBrandNameExists,
  BrandController.addBrand
);

module.exports = routes;
