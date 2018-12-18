const defaultValue = {
  C: true,
  R: true,
  U: true,
  D: true,
};

module.exports = (sequelize, DataTypes) =>
  sequelize.define('permission', {
    chat: {
      type: DataTypes.JSONB,
      defaultValue
    },
    setting: {
      type: DataTypes.JSONB,
      defaultValue
    },
    news: {
      type: DataTypes.JSONB,
      defaultValue
    },
  });
