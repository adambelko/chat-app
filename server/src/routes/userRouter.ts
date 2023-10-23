import express from "express";
const router = express.Router();

import {
  createUser_post,
  loginUser_post,
  userList_get,
  individualUser_get,
  refreshToken_post,
} from "../controllers/userController";

router.post("/signup", createUser_post);

router.post("/login", loginUser_post);

router.get("/", userList_get);

router.get("/:id", individualUser_get);

router.post("/refresh-token", refreshToken_post);

export default router;
