const express = require("express");

const {
  userImageUpload,
  userAvatarUpload,
  changeAvatar,
  updateUser,
} = require("../controllers/user");
const { protect, roleProtect } = require("../middlewares/auth");

const router = express.Router();

router.route("/image").post(protect, userImageUpload);
router.route("/avatar").post(protect, userAvatarUpload);
router.route("/avatar/:id").put(protect, changeAvatar);
router.route("/:id").put(protect, roleProtect("admin"), updateUser);
module.exports = router;
