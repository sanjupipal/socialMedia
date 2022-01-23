const { Sequelize, DataTypes } = require("sequelize");
const { UUID } = require("uuid");
const connection = {
  following: {
    type: DataTypes.UUID,
    allowNull: false,
    required: true,
  },
  user: {
    type: DataTypes.UUID,
    allowNull: false,
    required: true,
  },
};
app.sequelize.define("connection", connection, {
  indexes: [
    {
      unique: true,
      fields: ["following", "user"],
    },
  ],
});
