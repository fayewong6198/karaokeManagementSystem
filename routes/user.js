const express = require("express");

const {
  userImageUpload,
  userAvatarUpload,
  changeAvatar,
  updateUser,
  getUser,
  getAllUsers,
  createUser,
  deleteUser,
} = require("../controllers/user");
const { protect, roleProtect } = require("../middlewares/auth");
const { getUserSchedules } = require("../controllers/schedules");

const router = express.Router();

router.use("/:id/schedules", protect, roleProtect("admin"), getUserSchedules);

router.route("/image").post(protect, userImageUpload);
router.route("/avatar").post(protect, userAvatarUpload);
router.route("/avatar/:id").put(protect, changeAvatar);

router
  .route("/")
  .get(protect, roleProtect("admin"), getAllUsers)
  .post(protect, roleProtect("admin"), createUser);

router
  .route("/:id")
  .put(protect, roleProtect("admin"), updateUser)
  .get(protect, roleProtect("admin"), getUser)
  .delete(protect, roleProtect("admin"), deleteUser);
module.exports = router;
