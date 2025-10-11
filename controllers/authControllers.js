import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateTokenResponse } from "../utils/generateTokenResponse.js";

// simple email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// password must be 6+ chars, at least 1 number and 1 letter
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&{}]).{8,}$/;

const rules = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  special: /[!@#$%^&*{}]/,
  minLength: /.{8,}/,
};

const failedRules = [];

const validateUserValue = (name, email, password) => {
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  for (const [ruleName, regex] of Object.entries(rules)) {
    if (!regex.test(password)) {
      failedRules.push(ruleName);
    }
  }
  return failedRules;
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const failed = validateUserValue(name, email, password);
    if (failed.length > 0) {
      return res.status(400).json({
        message: "Password invalid",
        missing: failed,
      });
    }

    // check if user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //  response to client
    res.status(201).json(generateTokenResponse(user));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if field contains values
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email does not exist please register first",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Email does not exist please register first",
      });
    }

    // password match
    if (isMatch) {
      res.json(generateTokenResponse(user));
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
