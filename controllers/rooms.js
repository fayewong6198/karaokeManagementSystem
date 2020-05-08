const path = require("path");
const Room = require("../models/Room");
const Image = require("../models/Image");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs");

// @des Get all Rooms
// @route GET /api/rooms
// @access  Public
exports.getRooms = asyncHandler(async (req, res, next) => {
  const rooms = await Room.find();

  res.status(200).json({
    success: true,
    data: rooms,
  });
});

// @des Get Room
// @route GET /api/rooms/:id
// @access  Public
exports.getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate("images", "path");

  if (!room) {
    return next(new ErrorResponse(`Error`, 404));
  }
  res.status(200).json({ success: true, data: room });
});

// @des Create new Room
// @route POST /api/rooms
// @access  Private
exports.createRoom = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const room = await Room.create(req.body);

  res.status(200).json({ success: true, data: room });
});

// @des Update Room
// @route PUT /api/room/:id
// @access  Private
exports.updateRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!room) {
    return next(new ErrorResponse(`Error`, 404));
  }

  res.status(200).json({ success: true, data: room });
});

// @des Delete Room
// @route DELETE /api/rooms/:id
// @access  Private
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findByIdAndRemove(req.params.id);

  if (!Room) {
    return next(new ErrorResponse(`No room found`, 404));
  }

  // Delete all Image
  const images = await Image.find({ room: room._id });
  // Remove Image

  images.forEach((image) => {
    console.log("image " + image);
    fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image.path}`, function (err) {
      console.log(err);
    });
  });

  // Delete Image in database
  await Image.deleteMany({ room: room._id });

  res.status(200).json({ success: true, data: room });
});

// @des Delete many Image in Room
// @route DELETE /api/rooms/:id/image
// @access admin
exports.deleteRoomImages = asyncHandler(async (req, res, next) => {
  const images = await Image.deleteMany({
    room: req.params.id,
    _id: { $in: req.body.ids },
  });

  if (!images) return next(new ErrorResponse("Image or Room not found", 404));

  // Remove Image

  images.forEach((image) => {
    console.log("image " + image);
    fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image.path}`, function (err) {
      console.log(err);
    });
  });

  const room = await Room.find(req.params.id);

  return res.status(200).json({ success: true, data: room });
});

// @des Delete one Image in Room
// @route DELETE /api/rooms/:id/images/imageId
// @access admin
exports.deleteRoomImage = asyncHandler(async (req, res, next) => {
  const image = await Image.deleteMany({
    room: req.params.id,
    _id: req.params.imageId,
  });

  if (!image) return next(new ErrorResponse("Image or Room not found", 404));

  // Remove Image

  fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image.path}`, function (err) {
    console.log(err);
  });

  const room = await Room.find(req.params.id).populate("images", "path");

  return res.status(200).json({ success: true, data: room });
});

// @des Upload photo for Room
// @route PUT /api/rooms/:id/image
// @access  Private
exports.RoomImageUpload = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse(`Error`, 404));
  }

  console.log(req.files);
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  let files = [];

  Array.isArray(req.files.image) === false
    ? files.push(req.files.image)
    : (files = [...req.files.image]);

  for (let i = 0; i < files.length; i++) {
    // Make sure the image is a photo
    if (!files[i].mimetype.startsWith("image")) {
      console.log("MineType " + !files[i].mimetype);
      return next(new ErrorResponse(`Please upload a image file`, 400));
    }

    // Check filesize
    if (files[i].size > process.env.MAX_FILE_UPLOAD)
      return next(
        new ErrorResponse(
          `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`,
          404
        )
      );
    console.log(3);
    // Create custom filename
    const image = await Image.create({
      //    user: req.user.id,
      room: req.params.id,
    });

    files[i].name = `photo_${image._id}${path.parse(files[i].name).ext}`;
    image.path = files[i].name;
    await image.save();

    files[i].mv(
      `${process.env.FILE_UPLOAD_PATH}/${files[i].name}`,
      async (err) => {
        if (err) {
          console.error(err);
          // Delete Image
          image.remove();
          return next(new ErrorResponse(`Problem with file upload`, 404));
        }
      }
    );
  }
  const updatedRoom = await Room.findById(req.params.id).populate("images");

  return res.status(200).json({ success: true, data: updatedRoom });
});

//  ----------------------------------------Rooms  filter----------------------------------------------------------//
