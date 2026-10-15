import { generateToken } from "../utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export async function signup(req, res) {
  const { Name, Email, Password } = req.body;
  try {
    if (Password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }

    const user = await User.findOne({ Email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newUser = new User({
      Name: Name,
      Email: Email,
      Password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        Name: newUser.Name,
        Password: newUser.Password,
        ProfilePic: newUser.ProfilePic,
      });
    } else {
      res.status(404).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  const { Email, Password } = req.body;
  try {
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(Password, user.Password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      Name: user.Name,
      Email: user.Email,
      Password: user.Password,
      ProfilePic: user.ProfilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function logout(req, res) {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out Sucessfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Interanl server error" });
  }
}
