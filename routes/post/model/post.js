const { Sequelize, DataTypes } = require("sequelize");
const { UUID } = require("uuid");
const post = {
  _id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUID,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    required: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};
app.sequelize.define("post", post, {
  indexes: [
    {
      unique: true,
      fields: ["user_id", "_id"],
    },
  ],
});
