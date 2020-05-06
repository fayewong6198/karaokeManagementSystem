const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Schedule = require("../models/Schedule");

// @des View all schedule
// @route GET /api/schedules/
// @access  staff
exports.getschedules = asyncHandler(async (req, res, next) => {
  const schedules = await Schedule.find();

  return res.status(200).json({ success: true, data: schedules });
});

// @des Get one schedule
// @route GET /api/schedules/:id
// @access  staff
exports.getSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) return next(new ErrorResponse("Resource not found", 404));

  return res.status(200).json({ success: true, data: schedule });
});

// @des Create schedule
// @route POST /api/schedules/
// @access  Admin
exports.createSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.create(req.body);

  return res.status(200).json({ success: true, data: schedule });
});

// @des Update schedule
// @route PUT /api/schedules/:id
// @access  Admin
exports.updateschedule = asyncHandler(async (req, res, next) => {
  let schedule = await Schedule.findById(req.params.id);

  if (!schedule) return next(new ErrorResponse("schedule not found", 404));

  schedule = await Schedule.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });

  return res.status(200).json({ success: true, data: schedule });
});

// @des Delete schedule
// @route Delete /api/schedules/:id
// @access  Admin
exports.deleteschedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findByIdAndRemove(req.params.id);

  if (!schedule) {
    return next(new ErrorResponse("schedule not found", 404));
  }
  return res.status(200).json({ success: true, data: [] });
});
