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
  const fetchAllUser = async () => {
    const users = await user.find();
    res.json(users);
  };
  const addToDecibel = async () => {
    await user.findOneAndUpdate(
      {
        name: "sss",
        id: "test1",
        decibelHistory: {
          $elemMatch: { config: { min: 10 } },
        },
      },
      {
        $set: { "config.$.min": 1 },
      }
    );
  };
  if (req.method === "POST") {
    testName(req.body);
  }
  if (req.method === "PUT") {
    addToDecibel();
  }

  if (req.method === "GET") {
    fetchAllUser();
  }
};

export default handler;
