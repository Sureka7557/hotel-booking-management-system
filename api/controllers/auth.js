import User from "../models/User.js"
import bcrypt from "bcrypt";
import {createError} from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    console.log("REGISTER BODY:", req.body); // ✅ debug

    const newuser = new User({
  ...req.body,
  password: hash,
});

    await newuser.save();
    res.status(201).send("user created successfully");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong password");
    }

    // 🔥 CREATE TOKEN (VERY IMPORTANT)
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, ...otherDetails } = user._doc;

   res
  .cookie("access_token", token, {
    httpOnly: true,
  })
  .status(200)
  .json({
    ...otherDetails,
    token, // ✅ ADD THIS
  });
  } catch (err) {
    next(err);
  }
};