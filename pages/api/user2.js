import mongoose from "mongoose";
import user from "../../models/userModel";
const handler = async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://liors-database:lior.ah98@cluster0.iybrzvm.mongodb.net/decibel-meter?retryWrites=true&w=majority"
  );
  const selectedUser = async (body) => {
    const { name, password } = body;
    const findUser = await user.findOne({ name: name, password: password });
    res.json(findUser);
  };

  const addArrDecibelHistory = async (body) => {
    await user.findOneAndUpdate({ name: body.name }, { $push: { decibelHistory: { $each: body.arr } } });
    const userToFetch = await user.findOne({ name: body.name });

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
