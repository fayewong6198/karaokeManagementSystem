const mongoose = require("mongoose");
const fs = require("fs");

const Image = require("./Image");
const RoomSchema = new mongoose.Schema({
  roomID: {
    type: String,
    unique: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["available", "notAvailable"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RoomSchema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "room",
  justOne: false,
});

RoomSchema.pre("remove", async () => {
  const images = await Image.find({ Room: this._id });
  // Remove Image
  images.forEach((image) => {
    fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image._id}`, function (err) {
      console.log(err);
    });
  });

  // Delete Image in database
  await Image.deleteMany({ Room: this._id });
});

RoomSchema.pre("save", async () => {});

module.exports = mongoose.model("Room", RoomSchema);
