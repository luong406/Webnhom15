var LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
var bcrypt = require('bcryptjs');
module.exports = function (passport) {
  // Lưu ID của người dùng vào session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Cấu hình deserializeUser để lấy thông tin người dùng từ session
  passport.deserializeUser((user, done) => {
    User.findUserById(user.user_id)
      .then((result) => {
        // console.log(result);
        done(null, result);
      })
      .catch((error) => {
        return done(error, null);
      });
  });

  // Xử lý đăng nhập
  passport.use(
    'local-login',
    new LocalStrategy(function(username, password, done) {
      User.findUserByUsername(username)
      .then((user) => {
        // console.log(user);
        if (!user) {
          return done(null, false, {
            message: 'Sai tên đăng nhập hoặc mật khẩu.'
          });
        }

        bcrypt.compare(password, user.password, function(err, result) {
          if (err) {
            return done(err);
          }
          console.log('acc : ' + user.username + ' ' + user.password + ' ' + password, result);
          if (!result) {
            return done(null, false, {
              message: 'Sai tên đăng nhập hoặc mật khẩu.'
            });
          }
          return done(null, user);
        });
      })
      .catch((error) => {
        return done(error); 
      });
      
    })
  );

  // Xử lý đăng ký 
  passport.use(
    "local-register",
    new LocalStrategy({ passReqToCallback: true }, function (
      req,
      username,
      password,
      done
    ) {
      User.findUserByUsername(username)
        .then((user) => {
          if (user) {
            return done(null, false, { message: "Tên đăng nhập đã tồn tại!" });
          }

          if (password.length <= 6) {
            return done(null, false, {
              message: "Mật khẩu phải trên 6 ký tự!",
            });
          }

          if (req.body.password !== req.body.password2) {
            return done(null, false, { message: "Hai mật khẩu không khớp!" });
          }

          return User.createUser(username, password, req.body.address, req.body.phone_number, req.body.sex, 0)
            .then((user) => {
              return done(null,false, { message: "Đăng ký thành công" });
            })
            .catch((error) => {
              return done(error); 
            });
        })
        .catch((error) => {
          return done(error); 
        });
    })
  );
};
