import React, { useEffect, useState } from "react";
import axios from "axios";
import jsonLogic from "json-logic-js";
import { JSONPath } from "jsonpath-plus";

function DataJSON(props) {
  let str = `{"${props.variable}", "${props.query}"}`;
  return (
    <div className="mt-3"><pre>{str}</pre></div>
  )
}

function RuleJSON(props) {
  let str = `{"${props.operator}": [{var: "${props.variable}}", "${props.rule}"]}`
  return (
    <div className="mt-3">
      <pre>{str}</pre>
    </div>
  );
}

function RuleForm(props) {
  const [criteria, setCriteria] = useState("");
  const [value, setValue] = useState("");
  const [output, setOutput] = useState("");

  let queryResult = {};

  function buildQuery() {
    console.log(`value -> ${value}`);
    for (const [k, v] of Object.entries(JSON.parse(value))) {
      var e = JSONPath({
        flatten: true,
        path: v,
        json: JSON.parse(props.event),
      });
      // if (typeof e === "object" && e !== null) {
      //   e = JSON.stringify(e, undefined, 2);
      // }
      queryResult[k] = e;
      console.log(k, e);
    }
    console.log(`queryResult -> ${JSON.stringify(queryResult)}`);
  }
  
  
  function testRule() {
    buildQuery();
    console.log(`criteria -> `, criteria);
    var r = jsonLogic.apply(JSON.parse(criteria), queryResult );
    console.log(`executed rule -> `, r);
    setOutput(r);
  }

  return (
    <div className="mt-3 border-top">
      <div className="mt-3 col-md-12">
        <h2>Rule Form</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input className="form-control" id="title" placeholder="Title" />
            <label for="title">Title</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="event_type"
              placeholder="Event type"
            />
            <label for="event_type">Event type</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <textarea
              style={{ "font-size": 14, height: "100px" }}
              rows="10"
              className="form-control font-monospace"
              id="criteria_apply"
              placeholder="Rule criteria"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            />
            <label for="criteria_apply">Rule criteria</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <textarea
              style={{ "font-size": 14, height: "100px" }}
              rows="10"
              className="form-control font-monospace"
              id="criteria_data"
              placeholder="Rule data"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <label for="criteria_data">Rule data</label>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div class="input-group mb-3">
          <button class="btn btn-outline-secondary" type="button" onClick={testRule}>
            Test rule
          </button>
          <input
            type="text"
            className="form-control font-monospace"
            aria-label="variable-query"
            placeholder="output"
            value={output}
            readOnly
          />
        </div>
      </div>

      <div className="mb-3">
        <div>
          <button className="btn btn-primary">save rule</button>
        </div>
      </div>
    </div>
  );
}

function Builder() {
  const fetchEvents = async () => {
    const result = await axios.get("/api/events");
    const events = result.data;
    setEvents(events);
    setLoading(false);
  };
  const [operator, setOperator] = useState("");
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("");
  const [rule, setRule] = useState("");
  const [ruleResult, setRuleResult] = useState("");
  const [variable, setVariable] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showBuilder, setShowBuilder] = useState(true);
  const [showDataJSON, setShowDataJSON] = useState(false);
  const [showRuleJSON, setShowRuleJSON] = useState(false);
  const onShowRuleForm = () => setShowRuleForm(true);
  const onShowBuilder = () => setShowBuilder(false);
  const onShowDataJSON = () => setShowDataJSON(true);
  const onShowRuleJSON = () => setShowRuleJSON(true);

  useEffect(() => {
    fetchEvents();
    //   const listener = (event) => {
    //     if (event.code === "Enter" || event.code === "NumpadEnter") {
    //       evaluateQuery();
    //     }
    //   };
    //   document.addEventListener("keydown", listener);
    //   return () => {
    //     document.removeEventListener("keydown", listener);
    //   };
  }, []);

  function evaluateQuery() {
    //example query: $..source.x-github-event
    //more complex query: $..commits[*][?(@property === "modified" || @property === "added" || @property === "removed")]
    var e = JSONPath({ flatten: true, path: query, json: JSON.parse(event) });
    if (typeof e === "object" && e !== null) {
      e = JSON.stringify(e, undefined, 2);
    }
    setEvaluation(e);
  }

  function evaluateRule() {
    // example rule: {"==": [{"var" : "query"}, "push"]}
    // complex example rule: {"all": [{"var": "query"}, {"===": [{"var" : ""}, "README.md"]}]}
    var data = `{ "${variable}" : ${evaluation}}`;
    var r = `{ "${operator}" : [{"var": "${variable}"}, "${rule}"]}`;
    console.log(`inbound rule -> `, r);
    var e = jsonLogic.apply(JSON.parse(r), JSON.parse(data));
    console.log(`data -> `, data);
    console.log(`executed rule -> `, e);
    setRuleResult(e);
  }

  const loadEventData = async (id) => {
    const result = await axios.get(`/api/events/${id}`);
    const event = result.data;
    setEvent(JSON.stringify(event, undefined, 2));
  };

  return (
    <div className="container">
      <h1>Rule Builder</h1>
      <div className="row">
        <div className="col-md-12 mb-3">
          <div className="col-md-4">
            <select
              class="form-select"
              aria-label="Available Events"
              value={event}
              onChange={(e) => loadEventData(e.target.value)}
            >
              <option defaultValue>Available Events</option>
              {events.map((event) => (
                <option value={event._id}>{event.type}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-8">
          <div className="form-floating ">
            <textarea
              className="form-control font-monospace"
              style={{ "font-size": 12, height: "300px" }}
              rows="16"
              id="json"
              type="text"
              placeholder="event json"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
            />
            <label for="json">Event JSON</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating">
            <textarea
              className="form-control font-monospace"
              style={{ "font-size": 14, height: "300px" }}
              rows="16"
              id="result"
              type="text"
              placeholder="query result"
              value={evaluation}
              readOnly
            />
            <label for="result">Query result</label>
          </div>
        </div>
        <div className="col-md-12 mt-3">
          <div class="input-group mb-3">
            <label
              className="input-group-text font-monospace"
              for="inputGroupSelect01"
            >
              var:
            </label>
            <input
              type="text"
              className="form-control font-monospace"
              aria-label="variable-query"
              placeholder="variable"
              style={{ "max-width": "20%" }}
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
            />
            <input
              id="query"
              type="text"
              aria-label="value-query"
              className="form-control font-monospace"
              placeholder="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            ></input>
            <button
              class="btn btn-outline-secondary"
              type="button"
              onClick={evaluateQuery}
            >
              Test
            </button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              onClick={onShowDataJSON}
            >
              show json
            </button>
          </div>
          <div>
            {showDataJSON ? (
              <DataJSON variable={variable} query={query} />
            ) : null}
          </div>
        </div>
        <div className="col-md-12 mb-3">
          <div class="input-group">
            <label
              className="input-group-text font-monospace"
              for="inputGroupSelect01"
            >
              var:
            </label>
            <input
              type="text"
              className="form-control font-monospace"
              aria-label="Text input with dropdown button"
              placeholder="variable"
              style={{ "max-width": "20%" }}
              value={variable}
              readOnly
            />
            <select
              className="form-select font-monospace"
              id="inputGroupSelect01"
              style={{ "max-width": "10%" }}
              onChange={(e) => setOperator(e.target.value)}
            >
              <option selected>Operator</option>
              <option value="==">==</option>
              <option value="===">===</option>
              <option value="!=">!=</option>
              <option value="!==">!==</option>
              <option value="!">!</option>
              <option value="!!">!!</option>
              <option value="map">map</option>
              <option value="reduce">reduce</option>
              <option value="filter">filter</option>
              <option value="merge">merge</option>
              <option value="in">in</option>
              <option value="all">all</option>
              <option value="none">none</option>
              <option value="some">some</option>
              <option value="missing">missing</option>
            </select>
            <input
              type="text"
              aria-label="Last name"
              className="form-control font-monospace"
              id="rule"
              type="text"
              placeholder="rule"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
            ></input>
            <button
              class="btn btn-outline-secondary"
              type="button"
              onClick={evaluateRule}
            >
              Test
            </button>
            <input
              type="text"
              id="ruleResult"
              aria-label="output"
              className="form-control font-monospace"
              placeholder="output"
              readOnly
              value={ruleResult}
            ></input>
            <button
              class="btn btn-outline-secondary"
              type="button"
              onClick={onShowRuleJSON}
            >
              show json
            </button>
          </div>
          <div>
            {showRuleJSON ? (
              <RuleJSON operator={operator} rule={rule} variable={variable} />
            ) : null}
          </div>
          <div className="mb-3 mt-3">
            <div>
              <button className="btn btn-primary" onClick={onShowRuleForm}>
                create rule
              </button>
              {showRuleForm ? <RuleForm event={ event }/> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Builder;
