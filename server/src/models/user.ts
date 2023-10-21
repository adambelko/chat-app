import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  refreshToken: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
