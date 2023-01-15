import mongoose from "mongoose";
import user from "../../models/userModel";
const handler = async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://liors-database:lior.ah980@cluster0.iybrzvm.mongodb.net/decibel-meter?retryWrites=true&w=majority"
  );
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
