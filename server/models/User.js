const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    organization: { type: String, default: "" },
    role: { type: String, default: "Geologist" },
    avatarColor: { type: String, default: "#2563EB" },
    settings: {
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
      notifications: { type: Boolean, default: true },
      language: { type: String, default: "en" },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const { _id, name, email, organization, role, avatarColor, settings, createdAt } = this;
  return { id: _id, name, email, organization, role, avatarColor, settings, createdAt };
};

module.exports = mongoose.model("User", userSchema);
