const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComponentSchema = new Schema(
  {
    name: String,
    short_name: String,
    team_lead: String,
    releases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Release" }],
    rules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rule" }],
  },
  { timestamps: true }
);

//create schema for application
const ApplicationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The name text field is required"],
    },
    short_name: String,
    owner: {
      type: String,
    },
    components: [ComponentSchema]
  },
  { timestamps: true }
);

//create model for application
const Application = mongoose.model("application", ApplicationSchema);

module.exports = Application;
