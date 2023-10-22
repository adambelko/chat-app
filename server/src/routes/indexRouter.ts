import express from "express";
const router = express.Router();

import { createUser_post, loginUser_post } from "../controllers/userController";

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("yet to be implemented");
});

router.post("/signup", createUser_post);

router.post("/login", loginUser_post);

export default router;
