const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: "Your email is required",
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: "Your username is required",
    },
    password: {
      type: String,
      unique: true,
      required: "Your password is required",
    },
    active: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    activationToken: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  // auto-gen a salt and hash
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  let payload = {
    id: this._id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
  });

  return token;
};

// do not use the arrow function notation, it will change what 'this' is referring to,
// so it not pointing the user document anymore.
userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // expires in an hour
};

userSchema.methods.generateActivationToken = function () {
  this.activationToken = crypto.randomBytes(20).toString("hex");
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
