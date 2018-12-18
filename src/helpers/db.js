const db = require('../models/db')

const prepareUserData = (user, token) => ({
  message: 'ok',
  username: user.auth.username,
  firstName: user.firstName,
  surName: user.surName,
  middleName: user.middleName,
  id: user.id,
  image: user.image,
  permissionId: user.permission.id,
  permission: {
    chat: user.permission.chat,
    news: user.permission.news,
    setting: user.permission.setting,
  },
  access_token: token,
});

const createUser = ({username, password, firstName, surName, middleName, hash, salt}) =>
  db.models
  .user
  .create(
    {
      firstName,
      surName,
      middleName,
      auth: {
        username,
        hash,
        salt,
      },
      permission: {},
    },
    {
      include: [
        {model: db.models.auth},
        {model: db.models.permission},
      ]
    },
  )

const getUserById = id => db.models.user.findOne({
  where: { id },
  include: [
    {model: db.models.auth},
    {model: db.models.permission},
  ]
})

const getUserByUserName = username => db.models.user.findOne({
  include: [{
    model: db.models.auth,
    where: { username }
  },
    {model: db.models.permission},
  ]
})

const updateUser = async (user, { auth = {}, firstName, middleName, surName, image} ) => {
  const newUserPromise = user.update({
    firstName: firstName || user.firstName,
    middleName: middleName || user.middleName,
    surName: surName || user.surName,
    image: image || user.image,
  })

  const newAuthPromise = user.auth.update({
    hash: user.auth.hash,
    salt: user.auth.salt,
    ...auth,
  })

  await newUserPromise
  await newAuthPromise

  return await getUserById(user.id)
}

const updatePermission = async (id, props ) => {
  const permission = await db.models.permission.findOne({ where: {id} })

  return await permission.update({
    chat: {
      ...permission.chat,
      ...props.chat,
    },
    news: {
      ...permission.news,
      ...props.news,
    },
    setting: {
      ...permission.setting,
      ...props.setting,
    },
  })
}

const deleteUser = id => db.models.user.destroy({
  where: {id}
})

const createNews = props => db.models
  .news
  .create(props)

const getUsersList = () => db.models.user.findAll({
  include: [
    {model: db.models.auth},
    {model: db.models.permission},
  ]
})

const getNewsList = () => db.models.news.findAll({
  include: [{model: db.models.user}]
})

const updateNews = (id, props) => db.models.news.update(props, {
  where: {id}
})

const deleteNews = id => db.models.news.destroy({
  where: {id}
})

module.exports = {
  prepareUserData,
  createUser,
  updateUser,
  updatePermission,
  getUserById,
  getUserByUserName,
  getUsersList,
  deleteUser,
  createNews,
  getNewsList,
  updateNews,
  deleteNews,
};
