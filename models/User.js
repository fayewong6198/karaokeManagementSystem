const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Schedule = require("./Schedule");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    role: {
      type: String,
      enum: ["staff"],
      default: "staff",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 5,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    isAuthentication: {
      type: Boolean,
      default: true,
    },
    authenticationToken: String,
    confirmEmailExpire: Date,

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    salary: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("schedules", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "staff",
  justOne: false,
});

// Encrypt password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre("remove", async () => {
  // Delete Schedule in database
  await Schedule.deleteMany({ staff: this._id });
});

// Sign JWT and returnJwtToken
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate and hash confirm Email token
UserSchema.methods.getConfirmEmailToken = function () {
  // Generate token
  const confirmToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken
  this.authenticationToken = crypto
    .createHash("sha256")
    .update(confirmToken)
    .digest("hex");

  // Set expire
  this.confirmEmailExpire = Date.now() + 10 * 60 * 10000;
  return confirmToken;
};
module.exports = mongoose.model("User", UserSchema);
