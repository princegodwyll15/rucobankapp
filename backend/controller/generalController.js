exports.renderAboutPage = async (req, res) => {
  try {
    res.locals.message =
      "Welcome to RucoBank Ghana! Learn more about us below.";
    res.render("general/about", {
      title: "about",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.renderContactPage = async (req, res) => {
  try {
    res.locals.message = "Contact us for any inquiries. We're here to help!";
    res.render("general/contact", {
      title: "contact",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
0;
