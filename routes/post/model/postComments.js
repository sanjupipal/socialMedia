const { Sequelize, DataTypes } = require("sequelize");
const { UUID } = require("uuid");
const postComment = {
  _id: {
    type: DataTypes.UUID,
    primary: true,
    defaultValue: DataTypes.UUIDV4,
  },
  post_id: {
    type: DataTypes.UUID,
    defaultValue: UUID,
  },
  commented_by: {
    type: DataTypes.UUID,
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
