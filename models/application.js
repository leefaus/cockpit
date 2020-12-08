const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema for application
const ApplicationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The name text field is required"],
    },
    owner: {
      type: String,
    },
    releases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Release" }],
  },
  { timestamps: true }
);

//create model for application
const Application = mongoose.model("application", ApplicationSchema);

module.exports = Application;
