import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    trim:true
  },
  password: {
    type: String,
    required: true,
    select:false
  }, // never send back as API response . cause who tf would want their users data to get exposed even if its encrypted lmao .
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  addresses:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Address",
  }],
  defaultAddress:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Address'
  }
},{timestamps:true});

export default mongoose.model("User", userSchema);
