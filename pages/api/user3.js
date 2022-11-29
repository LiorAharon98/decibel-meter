import mongoose from "mongoose";
import user from "../../models/userModel";
const handler = async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://liors-database:lior.ah98@cluster0.iybrzvm.mongodb.net/decibel-meter?retryWrites=true&w=majority"
  );

  const testName = async (value) => {
    await user.findOneAndUpdate(
      { name: value.name },
      { $push: { decibelHistory: { [value.testName]: [{ $each: { volume: 0, avg: 0, alarm: false, date: "" } }] } } }
    );
    const response = await user.findOne({ name: value.name });
    res.json(response);
  };
  if (req.method === "POST") {
    testName(req.body);
  }
};

export default handler;
