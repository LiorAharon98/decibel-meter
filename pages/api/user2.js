import mongoose from "mongoose";
import user from "../../models/userModel";
require("dotenv").config();

const handler = async (req, res) => {
  mongoose.connect(process.env.NODE_ENV === "development" ? process.env.MONGODB_URI_LOCAL : process.env.MONGODB_URI);

  const selectedUser = async (body) => {
    const { username,password } = body;
    const findUser = await user.findOne({ username, password }, "-password");

    await res.json(findUser);
  };

  const addArrDecibelHistory = async (body) => {
    const { testName, arr, username } = body;
    await user.findOneAndUpdate(
      { [`decibelHistory.testName`]: testName, username },

      { $push: { [`decibelHistory.$.testNameArr`]: { $each: arr } } },
      { new: true },
    );
    res.json(true);
  };

  if (req.method === "POST") {
    selectedUser(req.body);
  }
  if (req.method === "PUT") {
    addArrDecibelHistory(req.body);
  }
};
export const config = {
  api: {
    externalResolver: true,
  },
};
export default handler;
