var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminController");

//admin
router.get("/home", adminController.getAdminHome);
module.exports = router;