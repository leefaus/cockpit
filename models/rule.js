const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ActionSchema = new Schema({
  event_type: String,
  method: String,
  url: String,
  headers: { type: mongoose.Schema.Types.Mixed },
  data: { type: mongoose.Schema.Types.Mixed },
  secrets: []
});

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
    criteria: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "The criteria is required"],
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "The input variables are required"],
    },
    actions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Release" }] 
    ,
    component: { type: mongoose.Schema.Types.ObjectId, ref: "Component" },
  },
  { timestamps: true }
);

//create model for rule
const Rule = mongoose.model("rule", RuleSchema);
const Action = mongoose.model("action", ActionSchema);

module.exports = { Rule, Action };
