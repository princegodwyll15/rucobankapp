const admin = require("../model/admin");
const express = require("express");

// Example: Get admin form data (edit as needed)
exports.getAdminFormData = async (req, res) => {
  try {
    res.render("adminForm", { title: "Create Admin" });
  } catch (error) {
    res.status(500).send("Error loading admin form");
  }
};
