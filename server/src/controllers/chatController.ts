import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ChatModel, { IChat } from "../models/chat";

export const chatList = asyncHandler(async (req, res, next) => {
  // const chatList = ChatModel.find({}).sort({})
});

export const individualChat = asyncHandler(async (req, res, next) => {});

export const newMessage = asyncHandler(async (req, res, next) => {
  const { participantIds } = req.body;

  const isValidParticipants =
    Array.isArray(participantIds) &&
    participantIds.every((id) => mongoose.Types.ObjectId.isValid(id));

  if (!isValidParticipants) {
    res.status(400).json({ message: "Invalid participant IDs" });
    return;
  }

  const newMessage = {
    _id: new mongoose.Types.ObjectId(),
    sender: participantIds[0],
    text: req.body.text,
    createdAt: new Date(),
  };

  const chat = await ChatModel.findOne({
    participants: { $all: participantIds },
  });

  // If chat exists, add the new message to the chat's messages array
  if (chat) {
    chat.messages.push(newMessage);
    await chat.save();
  } else {
    // If chat does not exist, create a new chat with the participants and the new message
    const newChat: IChat = new ChatModel({
      participants: participantIds,
      messages: [newMessage],
    });
    await newChat.save();
  }

  res.json({ message: "Message sent successfully" });
});

export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.body;
  const chatId = req.params.chatId;

  const chat = await ChatModel.findById(chatId);

  if (!chat) {
    res.status(404).json({ message: "Chat not found" });
    return;
  }

  chat.messages = chat.messages.filter((message) => message._id != messageId);
  await chat.save();

  res.json({ message: "Message deleted" });
});
