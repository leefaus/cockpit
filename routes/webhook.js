const express = require("express");
const router = express.Router();
const Release = require("../models/release");
const Event = require("../models/event");
const RulesEngine = require("../services/rules_engine");
const Rule = require("../models/rule");

let done = function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
};

router.post("/webhooks/:id/:type", async (req, res, next) => { 
  // console.log(req.headers)
  const RulesEngineInstance = new RulesEngine();
  const release = await Release.findOne({ component: req.params.id, current: true });
  // console.log(req.body)
  let event = new Event({
    type: req.params.type,
    headers: req.headers,
    body: req.body,
    release: release._id,
  });
  await event.save();
  release.events.push(event._id);
  await release.save();
  // await RulesEngineInstance.evaluateRules(event);
  res.json(event);
});

module.exports = router;