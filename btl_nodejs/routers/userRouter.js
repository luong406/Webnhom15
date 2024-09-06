var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");

router.get("/", productController.getHome);
router.get("/test", productController.getTest);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/change", authController.getChange);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get('/logout',authController.getLogout);
module.exports = router;