const mongoose = require("mongoose");
const { Schema } = mongoose;

const healthSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  BloodGroup: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    trim: true,
  },
  Age: {
    type: Number,
    required: true,
    min: [0, "Age cannot be negative"],
    max: [120, "Age cannot exceed 120"],
  },
  Anydisease: {
    type: String,
    maxLength: 50,
    trim: true,
    default: "None",
  },
});

const Health = mongoose.model("medical", healthSchema);
module.exports = Health;
