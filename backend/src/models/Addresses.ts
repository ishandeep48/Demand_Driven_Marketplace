import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postalCode:{
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  isDefault:{
    type:Boolean,
    default:false
  }
  // lets see if changing this to id is any better
},{timestamps:true});

export default mongoose.model("Address", addressSchema);
