require('../models/User')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys')

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({ googleId: profile.id })
            .save()
            .then(user => done(null, user));
        }
      })
      // User.findOne({ googleId: profile.id}, (error, user) => {
      //   if (error) { throw error }
      //   if (!user) {
      //     let newUser = new User({ googleId: profile.id})
      //     newUser.save((error, newUser) => {
      //       if (error) { throw error }
      //       console.log(newUser)
      //       done(null, newUser)
      //     })
      //   } else {
      //     console.log(user)
      //     done(null, user)
      //   }
      // })
    }
  )
)