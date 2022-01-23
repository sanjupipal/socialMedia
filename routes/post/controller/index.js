let db = app.sequelize.models;
const { QueryTypes } = require("sequelize");

const createPost = async (req, res) => {
  try {
    let { title, description } = req.body;
    let newPost = { title, description, user_id: req.decoded.id };
    newPost = await db.post.create(newPost);
    let returnValue = {
      postId: newPost.dataValues.id,
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

    let post = await db.post.findOne({ where: { id } });
    if (!post)
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    if (post.dataValues.user_id != req.decoded.id)
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    await db.post.destroy({ where: { id, user_id: req.decoded.id } });

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

    let post = await db.post.findOne({ where: { id } });
    if (!post)
      return res.status(400).json({ msg: `not valid post id = ${id}` });

    let obj = { post_id: id, user_id: req.decoded.id };
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

    let post = await db.post.findOne({ where: { id } });
    if (!post)
      return res.status(400).json({ msg: `not valid post id = ${id}` });

    await db.postLikes.destroy({
      where: { post_id: id, user_id: req.decoded.id },
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

    let post = await db.post.findOne({ where: { id } });
    if (!post)
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    let obj = {
      post_id: id,
      commented_by: req.decoded.id,
      comment,
    };

    comment = await db.postComments.create(obj);

    return res.status(200).json({ commentId: comment.dataValues.id });
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
      attributes: ["id", "title", "description", "createdAt"],
      include: [
        { model: db.postLikes },
        {
          model: db.postComments,
          attributes: ["id", "comment", "commented_by"],
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

    let post = await db.post.findOne({ where: { id } });
    if (!post)
      return res.status(200).json({ msg: `not valid post id = ${id}` });

    let data = await app.sequelize.query(
      `select post.id,post.title,post.description,  count(distinct likes.id) as likes,count(distinct comments.id) as comments from public.posts as post 
    join public."postLikes" as likes on likes.post_id = post.id
    join public."postComments" as comments on comments.post_id = post.id
    where post.id = '${id}'
    group by post.id;`,
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
