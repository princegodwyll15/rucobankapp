const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

router.get("/register/admin", adminController.getAdminFormData);

module.exports = router;
