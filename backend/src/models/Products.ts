import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 10,
  },
  demandScore: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
  },
});

export default mongoose.model("Product", productSchema);
