const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Payment = require("../models/Payment");

// @des View all Payment
// @route GET /api/payments/
// @access  staff
exports.getPayments = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find();

  return res.status(200).json({ success: true, data: payments });
});

// @des Get one Payment
// @route GET /api/payments/:id
// @access  staff
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) return next(new ErrorResponse("Resource not found", 404));

  return res.status(200).json({ success: true, data: payment });
});

// @des Create Payment
// @route POST /api/payments/
// @access  Admin
exports.createPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.create(req.body);

  return res.status(200).json({ success: true, data: payment });
});

// @des Update payment
// @route PUT /api/payments/:id
// @access  Admin
exports.updatePayment = asyncHandler(async (req, res, next) => {
  let payment = await Payment.findById(req.params.id);

  if (!payment) return next(new ErrorResponse("payment not found", 404));

  payment = await Payment.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });

  return res.status(200).json({ success: true, data: payment });
});

// @des Delete payment
// @route Delete /api/payments/:id
// @access  Admin
exports.deletePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findByIdAndRemove(req.params.id);

  if (!payment) {
    return next(new ErrorResponse("payment not found", 404));
  }
  return res.status(200).json({ success: true, data: [] });
});
