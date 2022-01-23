const router = require("express").Router();

const user = require("./user/routes/index");
router.use("/", user);

const post = require("./post/routes/index");
router.use("/", post);

module.exports = router;
