const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    sampleId: {
      type: Schema.Types.ObjectId,
      ref: "samples",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 3,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", BookingSchema);
module.exports = Booking;