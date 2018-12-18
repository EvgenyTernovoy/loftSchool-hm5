const bcrypt = require('bcryptjs');
const { verifyJwtToken, parsJwtToken, getJwtToken } = require('../helpers/auth')
const { prepareUserData, createUser, getUserById, getUserByUserName } = require('../helpers/db')

const checkToken = async (req, res) => {
  const { access_token: token } = JSON.parse(req.body);

  if(!token) {
    return res.json({
      error: 'Invalid token',
    });
  }

  try {
    await verifyJwtToken(token);
  } catch (e) {
    return res.json({
      error: 'Token expired',
    });
  }

  try {
    const payload = parsJwtToken(token);

    const user = await getUserById(payload.id)

    return res.json(prepareUserData(user, token))
  } catch (e) {
    throw new Error(e)
  }
}

const registration = async (req, res) => {
  const {username, password, firstName, surName, middleName} = JSON.parse(req.body);

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt, null)

    const newUser = await createUser({username, password, firstName, surName, middleName, hash, salt})

    const token = getJwtToken(newUser.id);
debugger
    return res.json(prepareUserData(newUser, token))

  } catch (err) {
    throw new Error(err)
  }
};

const authentication = async (req, res) => {
  const { username, password, remembered } = JSON.parse(req.body);

  try {
    const user = await getUserByUserName(username)

    if (!user) {
      return res.json({
        error: 'Enter valid login and password',
      });
    }

    const salt = user.auth.salt;
    const hash = await bcrypt.hash(password, salt, null)

    if (hash !== user.auth.hash) {
      return res.json({
        error: 'Incorrect password',
      });
    }

    const token = getJwtToken(user.id)

    if (remembered) {
      res.cookie('access_token', token, {
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      })
    }

    return res.json(prepareUserData(user, token));
  } catch (err) {
    throw new Error(err)
  }
};

module.exports = {
  registration,
  authentication,
  checkToken,
};
