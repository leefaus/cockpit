const express = require("express");
const router = express.Router();
const { Application, Component } = require("../models/application");
const Release = require("../models/release");
const Event = require("../models/event");
const { populate } = require("../models/event");
const { Rule, Action } = require("../models/rule");

router.get("/applications", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Application.find()
    .populate({ path: "components", model: Component })
    .then((data) => {
      console.log(`data => ${data}`)
      res.json(data)
    })
    .catch(next);
});

router.get("/applications/:id", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Application.findOne({ _id: req.params.id })
    .populate({
      path: "components",
      model: Component
    })
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/applications", (req, res, next) => {
  if (req.body.name) {
    Application.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: "The input field is empty",
    });
  }
});

router.post("/components", (req, res, next) => {
  if (req.body.name) {
    Component.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: "The input field is empty",
    });
  }
});

router.get("/components/:id", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Component.findOne({ _id: req.params.id })
    .populate({
      path: "releases",
      model: Release,
      populate: {
        path: "events",
        model: Event,
        populate: [{ path: "rules.ruleId", model: Rule }, { path: "rules.actionId", model: Action }],
        options: { sort: '-createdAt' }
      }
    })
    .populate({
      path: "application",
      model: Application,
    })
    .then((data) => res.json(data))
    .catch(next);
});

router.get("/components", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Component.find()
    .populate({ path: "rules.rule", model: Rule }).populate({path: "rules.actions", model: Action})
    .then((data) => {
      console.log(`data => ${data}`);
      res.json(data);
    })
    .catch(next);
});

// fancy sample
// db.components.aggregate([
//   { $match: { _id: ObjectId("6018beb4d443566d683d8a0c") } },
//   {
//     $lookup: {
//       from: "rules",
//       localField: "rules.rule",
//       foreignField: "_id",
//       as: "component_rule",
//     },
//   },
//   { $match: { "component_rule.event_type": "github" } },
//   {
//     $lookup: {
//       from: "actions",
//       localField: "rules.actions",
//       foreignField: "_id",
//       as: "component_actions",
//     },
//   },
//   { $project: { component_rule: 1, component_actions: 1 } },
// ]);

module.exports = router;
