const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = mongoose.model('users');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // match user
      User.findOne({ email }).then((user) => {
        if (!user) {
          return done(null, false, { message: 'No User Found' });
        }

        console.log('user: ', user);

        // match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          console.log('isMatch: ', isMatch);

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password Incorrect' });
          }
        });
      });
    })
  );

  // passport.use(
  //   new LocalStrategy(function (email, password, done) {
  //     User.findOne({ email }, function (err, user) {
  //       if (err) {
  //         return done(err);
  //       }

  //       if (!user) {
  //         return done(null, false);
  //       }

  //       return done(null, user);
  //     });
  //   })
  // );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
