const User = require("../model/useModel");

// Generates a random 14-digit account number as a string
function generateRandomAccountNumber() {
  return Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
}

const generateAccountNum = async (req, res, next) => {
  let unique = false;
  let accountNumber;

  // Keep generating until a unique account number is found
  while (!unique) {
    accountNumber = generateRandomAccountNumber();
    const existingUser = await User.findOne({ accountNumber });
    if (!existingUser) unique = true;
  }

  req.body.accountNumber = accountNumber;
  next();
};

module.exports = generateAccountNum;
