const Rule = require("../models/rule");
const Event = require("../models/event");
const axios = require("axios");
const jp = require("jsonpath");

class RulesEngine {
  executeRule(rule, ev) {
    var rule_result = false;
    var event = ev.toObject();
    rule.criteria.forEach((criteria) => {
      switch (criteria.comparison) {
        case "equals":
        //   console.log("Predicate = ", criteria.predicate);
          rule_result =
            rule_result ||
            jp.query(event, `$..["${criteria.subject}"]`)[0] ===
              criteria.predicate;
          break;
        case "not equal":
          rule_result =
            rule_result ||
            jp.query(event, `$..["${criteria.subject}"]`)[0] !=
              criteria.predicate;
          break;
        default:
          console.log(rule_result);
      }
    });
    // console.log(rule_result);
    return rule_result;
  }

  buildBody(action, event) {
    var body = {};
    action.body.forEach((element) => {
      var k = element;
      var v = jp.query(event, `$..${element}`)[0];
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
