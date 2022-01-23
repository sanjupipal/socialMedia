const { v4: uuid } = require("uuid");
let db = app.sequelize.models;
const validate = require("uuid-validate");
const { QueryTypes } = require("sequelize");

const createPost = async (req, res) => {
  try {
    let { title, description } = req.body;
    let newPost = { title, description, _id: uuid(), user_id: req.decoded._id };
    newPost = await db.post.create(newPost);
    let returnValue = {
      postId: newPost.dataValues._id,
      title: newPost.dataValues.title,
      description: newPost.dataValues.description,
    };
    return res.status(200).json(returnValue);
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("errors")) {
      error.message = error.errors[0].message;
    }
    return res.status(400).json({ msg: error.message });
  }
};

const removePost = async (req, res) => {
  try {
    let { id } = req.params;

    if (!validate(id, 4))
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    let post = await db.post.findOne({ where: { _id: id } });
    if (!post)
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    if (post.dataValues.user_id != req.decoded._id)
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    await db.post.destroy({ where: { _id: id, user_id: req.decoded._id } });

    return res.status(200).json({ msg: `post deleted with id ${id}` });
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("errors")) {
      error.message = error.errors[0].message;
    }
    return res.status(400).json({ msg: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    let { id } = req.params;

    if (!validate(id, 4))
      return res.status(400).json({ msg: `not valid post id = ${id}` });

    let post = await db.post.findOne({ where: { _id: id } });
    if (!post)
      return res.status(400).json({ msg: `not valid post id = ${id}` });

    let obj = { post_id: id, user_id: req.decoded._id };
    await db.postLikes.create(obj);

    return res.status(200).json({ msg: `post liked with id ${id}` });
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("errors")) {
      error.message = error.errors[0].message;
    }
    return res.status(400).json({ msg: error.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    let { id } = req.params;

    if (!validate(id, 4))
      return res.status(400).json({ msg: `not valid post id = ${id}` });

    let post = await db.post.findOne({ where: { _id: id } });
    if (!post)
      return res.status(400).json({ msg: `not valid post id = ${id}` });

    await db.postLikes.destroy({
      where: { post_id: id, user_id: req.decoded._id },
    });

    return res.status(200).json({ msg: `post unLiked with id ${id}` });
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("errors")) {
      error.message = error.errors[0].message;
    }
    return res.status(400).json({ msg: error.message });
  }
};

const comment = async (req, res) => {
  try {
    let { id } = req.params;
    let { comment } = req.body;

    if (!validate(id, 4))
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    let post = await db.post.findOne({ where: { _id: id } });
    if (!post)
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    let obj = {
      _id: uuid(),
      post_id: id,
      commented_by: req.decoded._id,
      comment,
    };

    comment = await db.postComments.create(obj);

    return res.status(200).json({ commentId: comment.dataValues._id });
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("errors")) {
      error.message = error.errors[0].message;
    }
    return res.status(400).json({ msg: error.message });
  }
};

const allPost = async (req, res) => {
  try {
    let data = await db.post.findAll({
      attributes: ["_id", "title", "description", "createdAt"],
      include: [
        { model: db.postLikes },
        {
          model: db.postComments,
          attributes: ["_id", "comment", "commented_by"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    data = data.map((value) => {
      value.dataValues.postLikes = value.dataValues.postLikes.length;
      return value;
    });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("errors")) {
      error.message = error.errors[0].message;
    }
    return res.status(400).json({ msg: error.message });
  }
};

const post = async (req, res) => {
  try {
    let { id } = req.params;

    if (!validate(id, 4))
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    let post = await db.post.findOne({ where: { _id: id } });
    if (!post)
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    let data = await app.sequelize.query(
      `select post._id,post.title,post.description,  count(distinct likes._id) as likes,count(distinct comments._id) as comments from public.posts as post 
    join public."postLikes" as likes on likes.post_id = post._id
    join public."postComments" as comments on comments.post_id = post._id
    where post._id = '${id}'
    group by post._id;`,
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("errors")) {
      error.message = error.errors[0].message;
    }
    return res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  createPost,
  removePost,
  likePost,
  unlikePost,
  comment,
  allPost,
  post,
};
