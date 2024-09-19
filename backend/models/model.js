import mongoose from "mongoose";

const mongoSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  increment: { type: Number, required: true },
  intervalDays: { type: Number, required: true },
  lastPriceUpdate: { type: Date, default: Date.now },
  currentPrice: { type: Number }
    }
);



export const mongo = mongoose.model('mongo', mongoSchema);