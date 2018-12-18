module.exports = (sequelize, DataTypes) =>
  sequelize.define('auth', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    hash:  {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    salt: DataTypes.STRING,
  })
