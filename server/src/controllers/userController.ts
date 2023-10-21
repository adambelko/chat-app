import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/user";
import { IUser } from "../models/user";

const createUser_post = asyncHandler(async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(`${req.body.password}`, 10);

    const user = new UserModel({
      username: req.body.username,
      password: hashedPassword,
    });

    const result = await user.save();
    res.json({ message: "User created successfully", user: result });
  } catch (err) {
    console.log(err);
  }
});

const loginUser_post = asyncHandler(async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
});

export { createUser_post, loginUser_post };
