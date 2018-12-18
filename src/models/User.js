module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: DataTypes.STRING,
    surName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    image: DataTypes.STRING,
  });
  User.associate = models => {
    User.belongsTo(models.auth);
    User.belongsTo(models.permission);
    User.hasMany(models.news);
  };
  return User;
};
