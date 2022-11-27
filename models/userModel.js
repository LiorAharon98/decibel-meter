import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
  name: String,
  password: String,
  decibelHistory: Array,
  timeLapse: Number,
});

const user = models.user || model("user", userSchema);
export default user;
