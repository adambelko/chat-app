import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: {
    _id: Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
}

const ChatSchema: Schema<IChat> = new Schema<IChat>({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const ChatModel = mongoose.model<IChat>("Chat", ChatSchema);

export default ChatModel;
