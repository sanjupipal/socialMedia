const { Sequelize, DataTypes } = require("sequelize");
const user = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
      fields: ["email", "id"],
    },
  ],
});
