const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema for event
const EventSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "The type text field is required"],
    },
    source: {
      type: String,
    },
    release: { type: mongoose.Schema.Types.ObjectId, ref: "Release" },
    nested: {
      raw: String,
    },
  },
  { timestamps: true }
);

//create model for event
const Event = mongoose.model("event", EventSchema);

module.exports = Event;
