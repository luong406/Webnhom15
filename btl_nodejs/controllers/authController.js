const User = require("../models/userModel");
const passport = require("passport");
exports.getLogin = (req, res, next) => {
  const message = req.flash("error")[0];
  if (!req.isAuthenticated()) {
    res.render("login", {
      title: "Đăng nhập",
      message: `${message}`
    });
  } else {
    if (req.session.passport.user.role == 1) {
      res.redirect("/admin/home");
    } 
    else res.redirect("/");
  }
};

// Controller xử lý logout
exports.getLogout = (req, res, next) => {
  // Sử dụng req.logout() để đăng xuất người dùng

  req.logOut();
      res.redirect("/login"); // Đảm bảo đường dẫn không gây redirect lặp
   
};

exports.getChange = (req, res, next) => {
  const message = req.flash("error")[0];
  res.render("change", {
    title: "Đổi mật khẩu",
    message: `${message}`
  });
};
exports.getRegister = (req, res, next) => {
  const message = req.flash("error")[0];
  res.render("register", {
    title: "Đăng ký",
    message: `${message}`,
  });
};
exports.postRegister = (req, res, next) => {
  passport.authenticate("local-register", {
    successReturnToOrRedirect: "/login",
    failureRedirect: "/register",
    failureFlash: true,
  })(req, res, next);
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local-login", {
    successReturnToOrRedirect: "/login",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

exports.getHome = (req, res, next) => {
  const message = req.flash("error")[0];
  res.render("home", {
    title: "Trang chủ",
    message: `${message}`,
  });
};
exports.getUser =(req,res) =>{
  console.log(req.params.user_id);
  User.getUser(req.params.user_id)
  .then(result =>{
    res.status(201).json({
      message: "Tim user thanh cong",
      User:result[0]
    });
  })
  .catch (err =>{
    console.log("Tim kiem that bai");
    res.status(500).json({
      message: "Tim lai di",
      error:err
    });
  });
}
exports.deleteUser =(req,res) =>{
  User.deleteUser(req.params.user_id)
  .then(result =>{
    res.status(201).json({
      message:"Xoa user thanh cong",
      User:req.params.user_id
    });
  })
  .catch(err =>{
    console.log ("Xoa that bai");
    res.status(500).json({
      message:"Xoa lai di",
      error:err
    });
  });
}