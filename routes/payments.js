const express = require("express");
const {
  getPayment,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/payments");

const { protect, roleProtect } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(getPayments)
  .post(protect, roleProtect("admin"), createPayment);

router.route("/:id").get(getPayment).put(updatePayment).delete(deletePayment);

module.exports = router;
