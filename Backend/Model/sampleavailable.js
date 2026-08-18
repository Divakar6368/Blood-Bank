const mongoose = require("mongoose");
const { Schema } = mongoose;

const sampleSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    BloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      trim: true,
    },
    Price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    Avilability: {
      type: Boolean,
      required: true,
      default: true,
    },
    TotalStock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    Discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
  },
  { timestamps: true }
);

sampleSchema.index({ storeId: 1, BloodGroup: 1 }, { unique: true });

const Sample = mongoose.model("samples", sampleSchema);
module.exports = Sample;
