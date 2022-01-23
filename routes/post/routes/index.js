require("../model/post");
require("../model/postComments");
require("../model/postLikes");
const router = require("express").Router();
const { authUser } = require("../../auth/index");

const {
  createPost,
  removePost,
  likePost,
  unlikePost,
  comment,
  allPost,
  post,
} = require("../controller/index");

router.post("/post", authUser, createPost);
router.get("/post_all", authUser, allPost);
router.get("/post/:id", authUser, post);
router.delete("/post/:id", authUser, removePost);

router.post("/like/:id", authUser, likePost);
router.post("/unlike/:id", authUser, unlikePost);

router.post("/comment/:id", authUser, comment);

module.exports = router;
