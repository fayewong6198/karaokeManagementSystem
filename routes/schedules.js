const express = require("express");
const {
  getSchedule,
  getSchedules,
  updateSchedule,
  createSchedule,
  deleteSchedule,
} = require("../controllers/schedules");
const router = express.Router({ mergeParams: true });

const { protect, roleProtect } = require("../middlewares/auth");

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
