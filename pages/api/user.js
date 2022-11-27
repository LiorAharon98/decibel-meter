import mongoose from "mongoose";
import user from "../../models/userModel";
const handler = async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://liors-database:lior.ah98@cluster0.iybrzvm.mongodb.net/decibel-meter?retryWrites=true&w=majority"
  );

  const addUser = async (data) => {
    const findUser = await user.findOne({ name: data.name, password: data.password });
    if (findUser) return res.json(null);
    const createdUser = await user.create(data);
    res.json(createdUser);
  };
  if (req.method === "PUT") {
  }
  if (req.method === "POST") {
    addUser(req.body);
  }
};
export default handler;
