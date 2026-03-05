const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "This Listing is deleted");
    return res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newData = new Listing(req.body.listing);
  newData.owner = req.user._id;
  newData.image = { url, filename };
  await newData.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.editListings = async (req, res) => {
  let { id } = req.params;
  let detail = await Listing.findById(id);
  if (!detail) {
    req.flash("error", "This Listing is deleted");
    return res.redirect("/listings");
  }

  let originalImageUrl = detail.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_200");
  res.render("listing/edit.ejs", { detail, originalImageUrl });
};

module.exports.updateListings = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  req.flash("success", "Listing Updeted");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
