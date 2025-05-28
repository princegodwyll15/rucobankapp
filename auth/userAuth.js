const User = require("../model/user");

exports.userAuth = async (req, res, next) => {
  try {
    const { emailPhone } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailPhone }, { phone: emailPhone }],
    });
    if (!user) {
      req.session.danger = "User not found.";
      return res.redirect("/user/login");
    }
    req.session.user = user;
    next();
  } catch (error) {
    req.session.danger = "Authorization error.";
    res.redirect("/user/login");
  }
};
