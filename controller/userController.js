const User = require("../model/useModel");
const bcrypt = require("bcrypt");

// *************************************
// user logout controller
// *************************************
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.session.danger = "Logout failed. Please try again.";
      return res.redirect("/user/dashboard");
    }
    res.clearCookie("connect.sid");
    res.redirect("/user/login");
  });
};

// *************************************
// user get controllers here
// *************************************
exports.getUserLoginPage = async (req, res) => {
  try {
    res.render("user/userLogin", {
      title: "Login",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    res.render("user/userDashboard", {
      title: "userDashboard",
      user: req.session.user, // <-- Correct way
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getUserSignUpFormPage = async (req, res) => {
  try {
    res.render("user/userSignUpForm", {
      title: "SignUp",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getEditUserDetailsFormPage = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      req.session.danger("User not found");
      return res.redirect("/user/dashboard");
    }
    res.render("user/userEditDetailsForm", {
      user: user,
      title: "User Edit",
    });
  } catch (error) {
    console.error("User Edit details error: " + error.message);
  }
};

// *************************************
// user post controllers here
// *************************************
exports.registerNewUserForm = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : null;
    const {
      fullName,
      email,
      phone,
      address,
      dateOfBirth,
      accountType, // from the form, for the first account
      password,
      confirmPassword,
      customerId,
      accountNumber,
    } = req.body;

    // Basic validation
    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !dateOfBirth ||
      !accountType
    ) {
      req.session.danger = "Missing required fields";
      return res.redirect("/user/register");
    }

    if (password !== confirmPassword) {
      req.session.danger = "Passwords do not match";
      return res.redirect("/user/register");
    }

    const existingUserPhone = await User.findOne({ phone });
    if (existingUserPhone) {
      req.session.danger = "Phone number already in use";
      return res.redirect("/user/register");
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      req.session.danger = "Email already in use";
      return res.redirect("/user/register");
    }

    if (!customerId || !accountNumber) {
      req.session.danger = "Account details missing";
      return res.redirect("/user/register");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the first account object
    const accounts = [
      {
        accountType: accountType,
        accountNumber: accountNumber,
        customerId: customerId,
        balance: 0,
        interestRate: 0, 
      },
    ];

    const user = new User({
      fullName, 
      email,
      phone,
      address,
      dateOfBirth,
      accounts,
      password: hashedPassword,
      image,
    });

    await user.save();

    req.session.success = "Registration successful! Welcome to RucoBank.";
    res.redirect("/user/dashboard");
  } catch (error) {
    console.error("Error creating user:", error);
    req.session.danger = "Internal server error";
    res.redirect("/user/register");
  }
};

exports.userProcessLogInForm = async (req, res) => {
  const { emailPhone, password } = req.body;
  try {
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailPhone }, { phone: emailPhone }],
    });

    if (!user) {
      req.session.danger = "Invalid credentials please try again.";
      return res.redirect("/user/login");
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.session.danger = "Invalid credentials please try again.";
      return res.redirect("/user/login");
    }

    // Login successful
    req.session.success = "Login successful!";
    req.session.user = user; // <-- Add this line
    res.redirect("/user/dashboard");
  } catch (error) {
    req.session.danger = "An error occurred. Please try again.";
    res.redirect("/user/login");
  }
};

exports.userSaveEdiitedUserData = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : null;
    const {
      fullName,
      email,
      phone,
      address,
      dateOfBirth,
      password,
      confirmPassword,
    } = req.body;

    // Find the user by ID from session
    const userId = req.session.user._id;

    // Prepare update object
    const updateData = {
      fullName,
      email,
      phone,
      address,
      dateOfBirth,
    };

    if (image) {
      updateData.image = image;
    }

    // If password fields are filled, validate and hash
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        req.session.danger = "Passwords do not match";
        return res.redirect("/user/edit");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.password = hashedPassword;
    }

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    req.session.user = updatedUser; // Update session with new user data
    req.session.success = "Profile updated successfully!";
    res.redirect("/user/dashboard");
  } catch (error) {
    console.error(error.message);
    req.session.danger = "Failed to update profile.";
    res.redirect("/user/edit");
  }
};

// Withdrawal example
exports.userWithDrawFromMyAccount = async (req, res) => {
  try {
    const { account: selectedAccountNumber, amount } = req.body;
    const userId = req.session.user._id;

    // Validate amount
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      req.session.danger = "Please enter a valid withdrawal amount.";
      return res.redirect("/user/dashboard");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      req.session.danger = "User not found.";
      return res.redirect("/user/dashboard");
    }

    // Find the account to withdraw from (by number only)
    const account = user.accounts.find(
      (acc) => acc.number === selectedAccountNumber
    );

    if (!account) {
      req.session.danger = "Account not found.";
      return res.redirect("/user/dashboard");
    }

    // Prevent withdrawal from loan account
    if (account.type.toLowerCase() === "loan") {
      req.session.danger = "Withdrawals cannot be made from a loan account.";
      return res.redirect("/user/dashboard");
    }

    // Check if account has enough balance
    if (account.balance < Number(amount)) {
      req.session.danger = "Insufficient balance in selected account.";
      return res.redirect("/user/dashboard");
    }

    // Deduct amount
    account.balance -= Number(amount);

    // Add a transaction record
    if (!user.transactionHistory) user.transactionHistory = [];
    user.transactionHistory.push({
      date: new Date(),
      type: "Withdrawal",
      amount: Number(amount),
      description: `Withdrawal from ${account.type} - ${account.number}`,
      status: "Completed",
      By: user.fullName,
    });

    await user.save();

    req.session.user = user; // Update session with new user data
    req.session.success = "Withdrawal successful!";
    return res.redirect("/user/dashboard");
  } catch (error) {
    console.error(error.message);
    req.session.danger = "Withdrawal failed. Please try again.";
    res.redirect("/user/dashboard");
  }
};

exports.userDepositToMyAccount = async (req, res) => {
  try {
    // Get the selected account number directly from the form
    const { account: selectedAccountNumber, amount } = req.body;
    const userId = req.session.user._id;

    // Validate amount
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      req.session.danger = "Please enter a valid deposit amount.";
      return res.redirect("/user/dashboard");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      req.session.danger = "User not found.";
      return res.redirect("/user/dashboard");
    }

    // Find the account to deposit into (by number only)
    const account = user.accounts.find(
      (acc) => acc.number === selectedAccountNumber
    );

    if (!account) {
      req.session.danger = "Account not found.";
      return res.redirect("/user/dashboard");
    }

    // Prevent deposit into loan account (optional)
    if (account.type.toLowerCase() === "loan") {
      req.session.danger = "Deposits cannot be made into a loan account.";
      return res.redirect("/user/dashboard");
    }

    // Add amount
    account.balance += Number(amount);

    // Add a transaction record
    if (!user.transactionHistory) user.transactionHistory = [];
    user.transactionHistory.push({
      date: new Date(),
      type: "Deposit",
      amount: Number(amount),
      description: `Deposit to ${account.type} - ${account.number}`,
      status: "Completed",
      By: user.fullName,
    });

    await user.save();

    req.session.user = user; // Update session with new user data
    req.session.success = "Deposit successful!";
    return res.redirect("/user/dashboard");
  } catch (error) {
    console.error(error.message);
    req.session.danger = "Deposit failed. Please try again.";
    res.redirect("/user/dashboard");
  }
};

exports.addNewAccount = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { accountType } = req.body;

    if (!accountType) {
      req.session.danger = "Please select an account type.";
      return res.redirect("/user/dashboard");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      req.session.danger = "User not found.";
      return res.redirect("/user/dashboard");
    }

    // Find all account numbers for this type
    const accountsOfType = user.accounts.filter(
      (acc) => acc.type.toLowerCase() === accountType.toLowerCase()
    );

    let baseAccountNumber = user.accountNumber; // Use user's main account number as base
    let newSuffix = 1;

    if (accountsOfType.length > 0) {
      // Get the highest suffix for this type
      const suffixes = accountsOfType.map((acc) => {
        const parts = acc.number.split("-");
        return parts.length > 1 ? parseInt(parts[1], 10) : 1;
      });
      newSuffix = Math.max(...suffixes) + 1;
    }

    // New account number format: baseAccountNumber-suffix (e.g., 1234567890-2)
    const newAccountNumber = `${baseAccountNumber}-${newSuffix}`;

    user.accounts.push({
      type: accountType.toLowerCase(),
      number: newAccountNumber,
      balance: 0,
    });

    await user.save();

    req.session.user = user;
    req.session.success = "New account created successfully!";
    res.redirect("/user/dashboard");
  } catch (error) {
    console.error(error.message);
    req.session.danger = "Failed to create account. Please try again.";
    res.redirect("/user/dashboard");
  }
};
