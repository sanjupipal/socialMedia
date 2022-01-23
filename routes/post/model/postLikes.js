const { Sequelize, DataTypes } = require("sequelize");
const post = {
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
};
app.sequelize.define("postLikes", post, {
  indexes: [
    {
      unique: true,
      fields: ["user_id", "post_id"],
    },
  ],
});
