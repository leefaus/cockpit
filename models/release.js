const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema for release
const ReleaseSchema = new Schema(
  {
    version: {
      type: String,
      required: [true, "The version text field is required"],
    },
    current: Boolean,
    component: { type: mongoose.Schema.Types.ObjectId, ref: "Component" },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true }
);

//create model for release
const Release = mongoose.model("release", ReleaseSchema);

module.exports = Release;
