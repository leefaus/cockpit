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
      type: mongoose.Schema.Types.Mixed,
    },
    release: { type: mongoose.Schema.Types.ObjectId, ref: "Release" },
    nested: {
      raw: mongoose.Schema.Types.Mixed,
    },
    rules: [
      {
        type: new mongoose.Schema(
          {
            title: String,
            ruleId: { type: mongoose.Schema.Types.ObjectId, ref: "Rule" },
            url: String,
            method: String,
            body: mongoose.Schema.Types.Mixed,
            response: mongoose.Schema.Types.Mixed,
          }, { timestamps: { createdAt: 'created_at' } })
      }],
  },
  { timestamps: true }
);

//create model for event
const Event = mongoose.model("event", EventSchema);

module.exports = Event;
