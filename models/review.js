const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  // use a string type for comment text
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    // pass the function so the default is evaluated at save time
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

// Export the Review model
module.exports = mongoose.model("Review", reviewSchema);
