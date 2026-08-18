const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    StoreName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: true,
      trim: true,
    },
    StoreLocation: {
      type: String,
      minLength: 2,
      maxLength: 100,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      minLength: 10,
      maxLength: 500,
      required: true,
      trim: true,
    },
    AvailableSamples: [
      {
        type: Schema.Types.ObjectId,
        ref: "samples",
      },
    ],
    totalsale: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalearning: {
      type: Number,
      default: 0,
      min: 0,
    },
    pending: [
      {
        type: Schema.Types.ObjectId,
        ref: "booking",
      },
    ],
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    openAt: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    closeAt: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
  },
  { timestamps: true }
);

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;
