require("../model/user");
require("../model/connections");
const { authUser } = require("../../auth/index");
const router = require("express").Router();

const {
  getUser,
  getUsers,
  createUser,
  addConnection,
  login,
  removeConnection,
} = require("../controller/index");

router.post("/authenticate", login);
router.get("/users", authUser, getUsers);
router.get("/user", authUser, getUser);
router.post("/createUser", createUser);
router.post("/follow/:id", authUser, addConnection);
router.post("/unfollow/:id", authUser, removeConnection);

module.exports = router;
