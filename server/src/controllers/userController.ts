import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel, { IUser } from "../models/user";

export const createUser_post = asyncHandler(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(`${req.body.password}`, 10);

  const user = new UserModel({
    username: req.body.username,
    password: hashedPassword,
  });

  const result = await user.save();
  res.json({ message: "User created successfully", user: result });
});

export const loginUser_post = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = (await UserModel.findOne({ username: username })) as IUser;

  if (!user) {
    res.status(400).json({ message: "Invalid username or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(400).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_ACCESS_TOKEN_SECRET as string
  );
  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.JWT_REFRESH_TOKEN_SECRET as string
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("access_token", token, { httpOnly: true });
  res.json({ token, refreshToken });
});

export const userList_get = asyncHandler(async (req, res, next) => {
  const userList = await UserModel.find({}).sort({ username: -1 }).exec();

  if (!userList) {
    res.status(404);
    return;
  }

  res.json({ userList });
});

export const individualUser_get = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = UserModel.findOne({ _id: userId });

  if (!user) {
    res.status(404);
    return;
  }

  res.json({ user });
});

export const refreshToken_post = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  const user = await UserModel.findOne({ refreshToken });

  if (!user) {
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }

  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );

  res.cookie("refresh_token", refreshToken, { httpOnly: true });
  res.json({ token });
});
