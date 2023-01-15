import mongoose from "mongoose";
import user from "../../models/userModel";
require("dotenv").config()
const handler = async (req, res) => {
 mongoose.connect(process.env.MONGODB_URI);
  const selectedUser = async (body) => {
    const { name, password } = body;

    const findUser = await user.findOne({ username: name, password: password });

    res.json(findUser);
  };

  const addArrDecibelHistory = async (body) => {
    const { testName, arr, username } = body;

    const userToFetch = await user.findOneAndUpdate(
      { [`decibelHistory.testName`]: testName, username },

      { $push: { [`decibelHistory.$.testNameArr`]: { $each: arr } } }
    );

    res.json(userToFetch);
  };

  if (req.method === "POST") {
    selectedUser(req.body);
  }
  if (req.method === "PUT") {
    addArrDecibelHistory(req.body);
  }
};
export default handler;
