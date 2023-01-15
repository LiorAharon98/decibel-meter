import mongoose from "mongoose";
import user from "../../models/userModel";
const handler = async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://liors-database:lior.ah980@cluster0.iybrzvm.mongodb.net/decibel-meter?retryWrites=true&w=majority"
  );
  const fetchAllUser = async () => {
    const users = await user.find();
    res.json(users);
  };
  const addUser = async (data) => {
    const findUser = await user.findOne({ username: data.name });
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
