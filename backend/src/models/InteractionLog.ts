// This is optional and in testing phase . final implementation will depend on how i feel at that moment
import mongoose from 'mongoose'
const interactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }, //Testing
  type: {
    type: String,
    enum: ["view", "click", "buy"],
  },
  timestamp: { type: Date, default: Date.now },
});
