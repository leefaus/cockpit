const Rule = require("../models/rule");
const Event = require("../models/event");
const axios = require("axios");
const jsonLogic = require("json-logic-js");
const { JSONPath } = require("jsonpath-plus");
const Release = require("../models/release");
const { Component } = require("../models/application");
const { ObjectId } = require("mongoose");
const { json } = require("express");

class RulesEngine {
  
  async sendAction(action, event) {
    var variables = {};
    for (const [k, v] of Object.entries(action.data)) {
      if (v.startsWith("$")) {
        console.log(`in the if -> ${k}, ${v}`);
        var e = JSONPath({
          flatten: true,
          path: v,
          json: event,
        });
        variables[k] = e[0];
      }
    }
    const result = await axios({
      method: action.method,
      url: action.url,
      data: variables,
      headers: { "Content-Type": "application/json" },
    });
    // console.log(result);
    return result
  }

  async evaluateRules(event) {
    const release = await Release.findOne({ _id: `${event.release}` })
    console.log(`component id => ${release.component}`)
    const query = [
      { $match: { _id: release.component } },
      { $unwind: "$rules" },
      {
        $lookup: {
          from: "rules",
          localField: "rules.rule",
          foreignField: "_id",
          as: "function",
        },
      },
      { $unwind: "$function" },
      { $match: { "function.event_type": event.type } },
      { $unwind: "$rules.actions" },
      {
        $lookup: {
          from: "actions",
          localField: "rules.actions",
          foreignField: "_id",
          as: "function.action",
        },
      },
      { $unwind: "$function.action" },
      { $project: { function: 1 } },
    ];
    
    const functions = await Component.aggregate(query);
    console.log(`functions => ${JSON.stringify(functions)}`)
    functions.forEach(async (f) => {
      var variables = {};
      console.log(f.function.input)
      for (const [k, v] of Object.entries(f.function.input)) {
        if (v.startsWith("$")) {
          console.log(`in the if -> ${k}, ${v}`);
          var e = JSONPath({
            flatten: true,
            path: v,
            json: event,
          });
          variables[k] = e[0];
        }
      }
      console.log(variables);
      console.log(`rule => ${JSON.stringify(f.function.criteria)}`)
      var r = jsonLogic.apply(f.function.criteria, variables)
      console.log(`rule result => ${r}`)
      if (r) {
        console.log(f.function.action)
        var result = await this.sendAction(f.function.action, event)
        event.rules.push({ "ruleId": f.function._id, "actionId": f.function.action._id, "status": result.status, "headers": result.headers, "config": result.config, "response": result.data })
        await event.save();

      }
    })
  }
}

module.exports = RulesEngine;
