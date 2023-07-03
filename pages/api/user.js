import mongoose from "mongoose";
import user from "../../models/userModel";
require("dotenv").config();
const handler = async (req, res) => {
  mongoose.connect(process.env.MONGODB_URI);
  const fetchAllUser = async () => {
    const users = await user.find({},'password');
    res.json(users);
  };
  const addUser = async (data) => {
    const findUser = await user.findOne({ username: data.username });
    if (findUser) return res.json(null);
    await user.create(data);
    res.json(true)
  };
  const createTestName = async (value) => {
    const { testName, timeLapse } = value;
    const response = await user.findOneAndUpdate(
      { username: value.username },

      { $push: { decibelHistory: { testName, timeLapse, testNameArr: [] } } },
      { new: true }
    );

    res.json(response.decibelHistory);
  };

  if (req.method === "PUT") {
    createTestName(req.body);
  }

  if (req.method === "POST") {
    addUser(req.body);
  }
  if (req.method === "GET") {
    fetchAllUser();
  }
};
export const config = {
  api: {
    externalResolver: true,
  },
}
export default handler;
