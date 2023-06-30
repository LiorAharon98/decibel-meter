import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
  username: String,
  password: String,
  decibelHistory: Array,
});

const user = models.user || model("user", userSchema);
export default user;
