require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const changePassword = async (user, oldPassword, password) => {
  if (!password) {
    return { err: null, hash: user.auth.hash}
  }

  const salt = user.auth.salt;
  const hash = await bcrypt.hash(oldPassword, salt, null)

  if (hash !== user.auth.hash) {
    return { err: 'Old password is invalid', hash: user.auth.hash }
  }

  const newSalt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(password, newSalt, null)
  return { err: null, auth: { hash: newHash, salt: newSalt } }
}

const getJwtToken = id => jwt.sign({ id }, process.env.SECRET, {expiresIn: '8h'});

const verifyJwtToken = token => jwt.verify(token, process.env.SECRET)

const parsJwtToken = token => jwt.decode(token, process.env.SECRET)

module.exports = {
  getJwtToken,
  verifyJwtToken,
  parsJwtToken,
  changePassword,
}
