const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
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
      }
    }
  },
  { timestamps: true }
);

const book = mongoose.model("booking", BookingSchema);
module.exports = book;
