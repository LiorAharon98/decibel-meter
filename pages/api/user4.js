import user from "../../models/userModel";
import mongoose from "mongoose";
const handler = async(req, res) => {
    await mongoose.connect(
        "mongodb+srv://liors-database:lior.ah98@cluster0.iybrzvm.mongodb.net/decibel-meter?retryWrites=true&w=majority"
      );
  const fetchAllUser = async () => {
  
      const users = await user.find();
    res.json(users);
  };
 if( req.method === "GET"){

      fetchAllUser();
  }
};
export default handler;
