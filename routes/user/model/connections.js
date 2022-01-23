const { Sequelize, DataTypes } = require("sequelize");
const connection = {
  following: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
  user: {
    type: DataTypes.INTEGER,
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
