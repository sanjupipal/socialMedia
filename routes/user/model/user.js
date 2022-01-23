const { Sequelize, DataTypes } = require("sequelize");
const { UUID } = require("uuid");
const user = {
  _id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUID,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
};
app.sequelize.define("users", user, {
  indexes: [
    {
      unique: true,
      fields: ["email"],
    },
  ],
});
