const express = require("express");
const {
  getRoom,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/rooms");
const router = express.Router({ mergeParams: true });

const Room = require("../models/Room");
const advancedResults = require("../middlewares/advancedResults");

const { protect, roleProtect } = require("../middlewares/auth");

router
  .route("/")
  .get(advancedResults(Room, ""), getRooms)
  .post(protect, roleProtect("admin"), createRoom);

router.route("/:id").get(getRoom).put(updateRoom).delete(deleteRoom);

module.exports = router;
