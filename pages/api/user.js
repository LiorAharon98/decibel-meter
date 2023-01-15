import mongoose from "mongoose";
import user from "../../models/userModel";
const handler = async (req, res) => {
  await mongoose.connect(process.env.MONGODB_URI);
  const fetchAllUser = async () => {
    const users = await user.find();
    res.json(users);
  };
  const addUser = async (data) => {
    console.log(data.username);
    const findUser = await user.findOne({ username: data.username });
    if (findUser) return res.json(null);
    const createdUser = await user.create(data);
    res.json(createdUser);
  };
  const createTestName = async (value) => {
    const response = await user.findOneAndUpdate(
      { username: value.username },

      { $push: { decibelHistory: { testName: value.testName, testNameArr: [] } } },
      { new: true }
    );

    res.json(response);
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
export default handler;
