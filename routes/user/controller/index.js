let db = app.sequelize.models;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");

const getUsers = async (req, res) => {
  try {
    let data = await db.users.findAll({ attributes: ["name", "email", "id"] });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    let data = await app.sequelize.query(
      `select users.id, 
sum(case when u1.user is null then 0 else 1 end) as following,
sum(case when u2.following is null then 0 else 1 end) as followers
from public.users as users
left join public.connections as u1 on u1.user = users.id
left join public.connections as u2 on u2.following = users.id
where users.id = '${req.decoded.id}'
group by users.id`,
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

const createUser = async (req, res) => {
  try {
    let {} = req.body;
    const saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;

    let data = await db.users.create(req.body);
    delete data.dataValues.password;
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("errors")) {
      error.message = error.errors[0].message;
    }
    return res.status(400).json({ msg: error.message });
  }
};

const addConnection = async (req, res) => {
  try {
    let { id } = req.params;

    let following = await db.users.findOne({ where: { id } });
    if (!following) return res.status(200).json({ msg: "Invalid follow id" });

    let obj = {
      user: req.decoded.id,
      following: id,
    };

    let data = await db.connection.create(obj);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.stack, msg: error.message });
  }
};

const removeConnection = async (req, res) => {
  try {
    let { id } = req.params;

    let following = await db.users.findOne({ where: { id } });
    if (!following) return res.status(200).json({ msg: "Invalid follow id" });

    let obj = {
      user: req.decoded.id,
      following: id,
    };

    await db.connection.destroy({ where: obj });

    return res
      .status(200)
      .json({ msg: `unfollowed ${following.dataValues.name}` });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.stack, msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await db.users.findOne({
      where: { email: email },
    });
    if (!user) return res.status(400).json({ msg: "invalid User/password !" });
    let validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ msg: "invalid User/password !" });

    let token = jwt.sign(user.dataValues, process.env.token_secret, {});

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error, msg: error.message });
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  addConnection,
  login,
  removeConnection,
};
