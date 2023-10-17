import mongoose, { Document, Schema } from "mongoose";

interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: {
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
