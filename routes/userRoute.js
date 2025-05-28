const userController = require("../controller/userController");
const express = require("express");
const router = express.Router();
const generateAccountNum = require("../middleware/generateAccountNum");
const generateCustomerID = require("../middleware/generateCustomerID");
const saveUserImageToUploads = require("../middleware/uplaodClientImage");
const { userAuth } = require("../auth/userAuth");
const { userDashboardAuth } = require("../auth/userDashBoardAuth");

// *************************************
// user get requests routes here
// *************************************
router.get("/user/logout", userController.logout);
router.get("/user/login", userController.getUserLoginPage);
router.get(
  "/user/dashboard",
  userDashboardAuth,
  userController.getUserDashboard
);
router.get(
  "/user/edit",
  userDashboardAuth,
  userController.getEditUserDetailsFormPage
);

router.get("/user/register", userController.getUserSignUpFormPage);

// *************************************
// user get requests routes here
// *************************************
// Route setup (example)
router.post(
  "/user/register",
  saveUserImageToUploads,
  generateCustomerID,
  generateAccountNum,
  userController.getUserInfoFromForm
);
router.post("/user/login", userAuth, userController.userProcessLogInForm);
router.post("/user/withdraw", userController.userWithDrawFromMyAccount);
router.post("/user/deposit", userController.userDepositToMyAccount);
router.post("/user/add-account", userController.addNewAccount);
module.exports = router;
