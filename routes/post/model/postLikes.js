const { Sequelize, DataTypes } = require("sequelize");
const { UUID } = require("uuid");
const post = {
  _id: {
    type: DataTypes.UUID,
    primary: true,
    defaultValue: DataTypes.UUIDV4,
  },
  post_id: {
    type: DataTypes.UUID,
    defaultValue: UUID,
  },
  user_id: {
    type: DataTypes.UUID,
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
