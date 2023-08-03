import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/features.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(new ErrorHandler("Please Entrer All Fields", 404));
    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("Email Already Registered", 404));
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });
    sendToken(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new ErrorHandler("Please Enter all Fields", 404));
    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Email dosent exist", 404));
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("password dosent match", 404));
    sendToken(user, res, "LoggedIn successfully", 200);
  } catch (error) {
    next(error);
  }
};

export const getmyprofile = async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
};
