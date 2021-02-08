const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComponentSchema = new Schema(
  {
    name: String,
    short_name: String,
    team_lead: String,
    releases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Release" }],
    rules: [
      {
        type: new mongoose.Schema({
          rule: { type: mongoose.Schema.Types.ObjectId, ref: "Rule" },
          actions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Action" }],
        }),
      },
    ],
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
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
    components: [{ type: mongoose.Schema.Types.ObjectId, ref: "Component" }],
  },
  { timestamps: true }
);

//create model for application
const Application = mongoose.model("application", ApplicationSchema);
const Component = mongoose.model("component", ComponentSchema);

module.exports = { Application, Component };
