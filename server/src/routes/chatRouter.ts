import express from "express";
const router = express.Router();

import {
  chatList,
  individualChat,
  newMessage,
  deleteMessage,
} from "../controllers/chatController";

router.get("/", chatList);

router.post("/", individualChat);

router.post("/new-message", newMessage);

router.post("/delete-message", deleteMessage);

export default router;
