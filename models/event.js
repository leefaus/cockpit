const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema for event
const EventSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "The type text field is required"],
    },
    headers: {
      type: mongoose.Schema.Types.Mixed,
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
    },
    release: { type: mongoose.Schema.Types.ObjectId, ref: "Release" },
    rules: [
      {
        type: new mongoose.Schema(
          {
            ruleId: { type: mongoose.Schema.Types.ObjectId, ref: "Rule" },
            actionId: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
            status: String,
            headers: mongoose.Schema.Types.Mixed,
            config: mongoose.Schema.Types.Mixed,
            response: mongoose.Schema.Types.Mixed,
          },
          { timestamps: { createdAt: "created_at" } }
        ),
      },
    ],
  },
  { timestamps: true }
);

//create model for event
const Event = mongoose.model("event", EventSchema);

module.exports = Event;
