const express = require("express");
const router = express.Router();
const generalController = require("../controller/generalController");

router.get("/about/rucobank", generalController.renderAboutPage);
router.get("/contact/rucobank", generalController.renderContactPage);

module.exports = router;
