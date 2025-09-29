const User = require("../users/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      title,
      firstName,
      lastName,
      region,
      country,
      nationality,
    } = req.body;

    if (password != confirmPassword)
      return res.status(400).json({ message: "passwords does not match" });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    const salt = 10;
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashed,
      title,
      firstName,
      lastName,
      region,
      country,
      nationality,
    });
    res.status(201).json({ message: "signup successfull" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "sercer error" });
  }
};

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return res.status(200).json({
//       message: "Login successful",
//       role:"user",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account is not yet approved. Please contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      role: "user",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signUp, login };
