const mongoose = require("mongoose");

let User;
try {
  User = mongoose.model("User");
} catch (error) {
  User = require("../users/user.model");
}

const qnaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["ask_kia", "goef_event"],
      default: "ask_kia",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

qnaSchema.pre("save", async function (next) {
  try {
    if (!this.country && this.createdBy) {
      const user = await User.findById(this.createdBy).select("country");
      if (user && user.country) {
        this.country = user.country;
      }
    }
    next();
  } catch (error) {
    console.error("Error in qnaSchema.pre(save):", error.message);
    next(error);
  }
});

module.exports = mongoose.model("Qna", qnaSchema);
