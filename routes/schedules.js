const express = require("express");
const {
  getSchedule,
  getSchedules,
  updateSchedule,
  createSchedule,
  deleteSchedule,
} = require("../controllers/schedules");

const { protect, roleProtect } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(getSchedules)
  .post(protect, roleProtect("admin"), createSchedule);

router
  .route("/:id")
  .get(getSchedule)
  .put(updateSchedule)
  .delete(deleteSchedule);

module.exports = router;
