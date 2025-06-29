exports.userDashboardAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.session.danger = "Please log in to access your dashboard.";
  res.redirect("/user/login");
};
