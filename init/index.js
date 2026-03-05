const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("conected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wonderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "699c4027a864d27cc051dbb9",
  }));
  await Listing.insertMany(initData.data);
  console.log("save to DB");
};

initDB();
