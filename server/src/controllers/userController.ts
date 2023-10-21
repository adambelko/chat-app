import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/user";

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

export { createUser_post };
