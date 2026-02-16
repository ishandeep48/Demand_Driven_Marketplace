import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  cartID: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      price: {
        type: Number,
        required: true, // snapshot price
      },
    },
  ],
});

export default mongoose.model("Cart",cartSchema);
