const User = require("../models/userModel");
const passport = require("passport");
exports.getAdminHome = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    } else {
      if(req.session.passport.user.role==1){
        res.render("admin/homeAdmin", {
          title: "Home Admin",
        });
      }
      else res.redirect("/register");
    }
  };