require('dotenv').config()
const passportJwt = require('passport-jwt')
const db = require('../models/db')
const { Strategy, ExtractJwt} = passportJwt

const options = {
  jwtFromRequest: ExtractJwt.fromBodyField('access_token'),
  secretOrKey: process.env.SECRET,
}

const strategy = new Strategy(options, async (payload, done) => {
  try{
    const user = await db.models.user.findOne({ where: {id: payload.id} });

    if (!user) {
      return done(new Error('User not found'))
    }

    return done(null, user)
  } catch (err) {
    return done(err)
  }
})

module.exports = strategy
