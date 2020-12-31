const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema for rule
const RuleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "The title type text field is required"],
    },
    event_type: {
      type: String,
      required: [true, "The event type text field is required"],
    },
    criteria: { type: [] },
    // subject: {
    //   type: String,
    //   required: [true, "The subject text field is required"],
    // },
    // predicate: {
    //   type: String,
    //   required: [true, "The predicate text field is required"],
    // },
    action: {
      type: [],
      required: [true, "The action text field is required"],
    },
    active: Boolean,
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  },
  { timestamps: true }
);

//create model for rule
const Rule = mongoose.model("rule", RuleSchema);

module.exports = Rule;
