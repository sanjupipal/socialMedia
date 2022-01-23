const { Sequelize, DataTypes } = require("sequelize");
const post = {
  user_id: {
    type: DataTypes.INTEGER,
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
      fields: ["user_id"],
    },
  ],
});
