import User from "../Model/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import GenerateToken from "../utils/generateToken.js";

export async function Register(req, res) {
  try {
    const { username, email, password } = req.body;

    // basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // check existing user
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new User({
      username: username.trim(),
      email: normalizedEmail,
      password: hashpassword,
    });

    const saveUser = await newUser.save();

    // generate token (assumes GenerateToken returns a string JWT)
    const token = GenerateToken(saveUser);


    // successful response
    return res.status(201).json({
      message: "User successfully registered",
      user: {
        id: saveUser._id,
        username: saveUser.username,
        email: saveUser.email,
      },
      token, // <-- lowercase token for consistency with frontend
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: error.message || "Error in registration" });
  }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const valid = await User.findOne({ email });
        if (!valid) {
            return res.status(400).json({ message: "Email does not exist" });
        }

        const match = await bcrypt.compare(password, valid.password);
        if (!match) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        const token = GenerateToken(valid);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: valid._id,
                username: valid.username,
                email: valid.email,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Login error" });
    }
};

