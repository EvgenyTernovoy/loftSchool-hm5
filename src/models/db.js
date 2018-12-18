require('dotenv').config();
const Sequelize = require('sequelize');
const config = require('../../config').db;

const sequelize = new Sequelize(process.env.DATABASE_URL, config.opts);

sequelize.sync();
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const modelNames = [
  'User',
  'Auth',
  'Permission',
  'News'
];

modelNames.map(item => sequelize.import(`./${item}.js`));

for(const modelName of Object.keys(sequelize.models)) {
  if('associate' in sequelize.models[modelName]) {
    sequelize.models[modelName].associate(sequelize.models);
  }
}

module.exports = sequelize;
