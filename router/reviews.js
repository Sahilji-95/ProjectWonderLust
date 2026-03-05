const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { createReview, deleteReview } = require("../Controllers/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middelware.js");

//Create Route

router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

//Delete Route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview),
);

module.exports = router;
