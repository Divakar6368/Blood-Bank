const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "booking",
      },
    ],
    Location: {
      type: String,
      required: true,
      default: "delhi",
    },
    MedicalInfo: {
      type: Schema.Types.ObjectId,
      ref: "medical",
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
