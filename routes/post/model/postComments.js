const { Sequelize, DataTypes } = require("sequelize");
const postComment = {
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
  commented_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
};
app.sequelize.define("postComments", postComment, {
  indexes: [
    {
      fields: ["post_id", "commented_by"],
    },
  ],
});
