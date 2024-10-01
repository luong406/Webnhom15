var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");

//admin
router.get("/home", adminController.getAdminHome);
router.post("/product", productController.addProduct);
router.delete("/product/:product_id", productController.deleteProduct);
router.get("/product/:product_id", productController.getProduct);
router.get("/admin/:user_id", authController.getUser);
module.exports = router;