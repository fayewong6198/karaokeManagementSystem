const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productImageUpload,
  productsFilter,
  deleteProductImages,
  deleteProductImage,
} = require("../controllers/products");

const advancedResults = require("../middlewares/advancedResults");
const { protect, roleProtect } = require("../middlewares/auth");
const checkImage = require("../middlewares/file");
const Product = require("../models/Product");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Product, ""), getProducts)
  .post(protect, roleProtect("admin"), createProduct);
// .post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

router.route("/:id/image").put(productImageUpload).delete(deleteProductImages);

router.route("/:id/image/:imageId").delete(deleteProductImage);

router.get("/filter/by", productsFilter);
module.exports = router;
