import express from "express";
const router = express.Router();

import { createUser_post, loginUser_post } from "../controllers/userController";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", createUser_post);

router.post("/login", loginUser_post);

export default router;
