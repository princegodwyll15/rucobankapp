const User = require("../model/useModel");

const generateCustomerID = async (req, res, next) => {
  // Find the user with the highest customerId
  const lastUser = await User.findOne({})
    .sort({ customerId: -1 })
    .select("customerId")
    .lean();

  let nextId = 1;
  if (lastUser && lastUser.customerId) {
    nextId = parseInt(lastUser.customerId, 10) + 1;
  }

  // Pad with leading zeros to ensure 6 digits
  req.body.customerId = String(nextId).padStart(6, "0");
  next();
};

module.exports = generateCustomerID;
