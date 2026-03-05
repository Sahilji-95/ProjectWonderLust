const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/singup.ejs");
};

module.exports.signUp = async (req, res, next) => {
  let { username, email, password } = req.body;
  let addUser = new User({
    username,
    email,
  });
  let newUser = await User.register(addUser, password);
  req.login(newUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Welcome !! You are Logged in");
    res.redirect("/listings");
  });
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome !! You are Logged in");
  let rediUrl = res.locals.redirectUrl || "/listings";
  res.redirect(rediUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are successfull LogOut");
    res.redirect("/listings");
  });
};
