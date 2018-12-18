const { prepareUserData, getUserById, updateUser, getUsersList, deleteUser, updatePermission } = require('../helpers/db')
const { getJwtToken, changePassword, } = require('../helpers/auth')
const uploadImg = require('../helpers/upload')

const update = async (req, res) => {
  const { firstName, id, middleName, oldPassword, password, surName } = JSON.parse(req.body);

  try {
    const user = await getUserById(id)

    const newPassword = await changePassword(user, oldPassword, password)

    if (newPassword.err) {
      return res.json({error: newPassword.err})
    }

    const token = getJwtToken(user.id)

    const result = await updateUser(user, {
      auth: newPassword.auth,
      firstName,
      middleName,
      surName,
    });

    res.json(prepareUserData(result, token));
  } catch (e) {
    throw new Error(e)
  }
}

const updateUserPermissions = async (req, res) => {
  const { permissionId, permission } = JSON.parse(req.body);

  try {
    await updatePermission(permissionId, permission);

    res.json({message: 'Ok'});
  } catch (e) {
    throw new Error(e)
  }
}

const uploadImage = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id)

    const uploadedImg = await uploadImg(req)

    await updateUser(user, { image: uploadedImg });

    res.json({path: uploadedImg});
  } catch (e) {
    throw new Error(e)
  }
}

const getList = async (req, res) => {
  try {
    const users = await getUsersList()

    const result = users.reduce((acc, item) => [
      ...acc,
      prepareUserData(item)
    ], [])

    return res.json(result)
  } catch (e) {
    throw new Error(e)
  }
}

const deleteItem = async (req, res) => {
  try {
    await deleteUser(req.params.id)

    const result = await getUsersList()
    return res.json(result)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  update,
  uploadImage,
  getList,
  deleteItem,
  updateUserPermissions,
}
