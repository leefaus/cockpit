const Rule = require("../models/rule");
const Event = require("../models/event");
const axios = require("axios");
const jsonLogic = require("json-logic-js");
const { JSONPath } = require("jsonpath-plus");

class RulesEngine {
  executeRule(rule, payload) {
    // console.log(`Rule = ${rule}`)
    var rule_result = false;
    var r = rule.toObject();
    var data = r.criteria.data;
    var p = payload.toObject();
    // console.log(`JSON data = ${data}`);
    // console.log(`payload data = ${payload}`);
    for (let k in data) {
      // console.log(`k = ${data[k]}`);
      var e = JSONPath({
        flatten: true,
        path: data[k],
        json: payload,
        wrap: false
      });
      // if (typeof e === "object" && e !== null) {
      //   e = JSON.stringify(e);
      // }
      data[k] = e[0];
    }
    console.log(`JSON data = ${JSON.stringify(data)}`);
    console.log(`JSON rules = ${JSON.stringify(rule.criteria.apply)}`);
    rule_result = jsonLogic.apply(
      rule.criteria.apply,
      data
    );
    console.log(`rule_result = ${rule_result}`);
    return rule_result;
  }

  buildBody(action, event) {
    var body = {};
    action.body.forEach((element) => {
      var k = element;
      var v = JSONPath({ json: event, path: `$..${element}` })[0];
      //   console.log(`${element} for k = ${k} and v = ${v}`);
      body[k] = v;
    });
    // console.log("body = ", body);
    return body;
  }

  async evaluateRules(event) {
    const rules = await Rule.find({ event_type: event.type, active: true });
    rules.forEach(async (rule) => {
      //   var r = rule.toObject();
      //   console.log("Rule = ", r);
      if (this.executeRule(rule, event)) {
        rule.action.forEach(async (a) => {
          const body = this.buildBody(a, event);
          const status = await axios.request({
            url: a.url,
            method: a.method.toLowerCase(),
            data: body,
          });
          // console.log("Status = ", status);

          const ruleEvent = {
            title: rule.title,
            ruleId: rule._id,
            url: a.url,
            method: a.method.toLowerCase(),
            body: body,
            response: { status: status.status, text: status.statusText },
          };

          event.rules.push(ruleEvent);

          const hmm = await event.save();
          //   console.log(hmm);
        });
      }
    });
  }
}

module.exports = RulesEngine;
