var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");

router.get("/", productController.getHome);
router.get("/cart", productController.getCart);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/change", authController.getChange);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get('/logout',authController.getLogout);

router.post('/add-to-cart', productController.addCart);
router.post('/add-to-order', productController.addOrder);
router.get('/order', productController.getOrder);
router.post('/order', productController.submitOrder);
module.exports = router;