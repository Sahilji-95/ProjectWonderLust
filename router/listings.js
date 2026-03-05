const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });
const { isLoggedIn, isOwner, validateSchema } = require("../middelware.js");
const {
  index,
  renderNewForm,
  showListings,
  createNewListing,
  editListings,
  updateListings,
  deleteListings,
} = require("../Controllers/listings.js");

//Show route

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    validateSchema,
    upload.single("listing[image]"),
    wrapAsync(createNewListing),
  );

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(updateListings),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListings));

//EDIT Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListings));

module.exports = router;
