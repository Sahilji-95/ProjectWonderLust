const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const {
  renderSignUpForm,
  signUp,
  renderLoginForm,
  login,
  logout,
} = require("../Controllers/users.js");

router.route("/singup").get(renderSignUpForm).post(wrapAsync(signUp));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login,
  );

router.get("/logout", logout);

module.exports = router;
