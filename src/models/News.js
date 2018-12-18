module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('news', {
    date: DataTypes.STRING,
    text: DataTypes.STRING,
    theme: DataTypes.STRING,
  });
  News.associate = (models) => {
    News.belongsTo(models.user);
  };
};
