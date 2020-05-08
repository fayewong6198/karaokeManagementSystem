const mongoose = require("mongoose");
const ScheduleSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  weekDay: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  },
  start: {
    type: String,
  },
  end: {
    type: String,
  },
  workingTime: {
    type: String,
    enum: ["morning", "afternoon", "evening"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
