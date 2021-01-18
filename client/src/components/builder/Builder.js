import React, { useEffect, useState } from "react";
import axios from "axios";
import jsonLogic from "json-logic-js";
import { JSONPath } from "jsonpath-plus";

function RuleForm() {
  return (
    <div className="container mt-3 border-top">
      <div className="row mt-3">
        <h2>Rule Form</h2>
      </div>
      <div className="mt-3 col-md-6">
        <div className="form-floating mb-3">
          <input className="form-control" id="title" placeholder="Title" />
          <label for="title">Title</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="event_type"
            placeholder="Event type"
          />
          <label for="event_type">Event type</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Active
          </label>
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
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("");
  const [rule, setRule] = useState("");
  const [ruleResult, setRuleResult] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const onShowRuleForm = () => setShowRuleForm(true);

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
      var data = `{ "query" : ${evaluation}}`;
      console.log(`inbound rule -> `, rule);
      var e = jsonLogic.apply(JSON.parse(rule), {
        query: JSON.parse(evaluation),
      });
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
      <h1>JSONPath Builder</h1>
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
        <div className="col-md-6">
          <div className="form-floating ">
            <textarea
              className="form-control font-monospace"
              style={{ "font-size": 14, height: "300px" }}
              rows="16"
              id="json"
              type="text"
              placeholder="event json"
              value={event}
              readOnly
              onChange={(e) => setEvent(e.target.value)}
            />
            <label for="json">Event JSON</label>
          </div>
        </div>
        <div className="col-md-6">
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
        <div className="col-md-6 mt-3">
          <div className="form-floating">
            <input
              className="form-control font-monospace"
              id="query"
              type="text"
              placeholder="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <label for="query">JSONPath query</label>
          </div>
        </div>
        <div className="col-md-6 mt-3">
          <div>
            <button className="btn btn-primary" onClick={evaluateQuery}>
              evaluate path
            </button>
          </div>
        </div>
        <div className="col-md-6 mt-3">
          <div className="form-floating">
            <textarea
              className="form-control font-monospace"
              style={{ "font-size": 14, height: "100px" }}
              id="rule"
              type="text"
              placeholder="rule"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
            />
            <label for="query">Rule definition</label>
          </div>
        </div>
        <div className="col-md-6 mt-3">
          <div className="form-floating">
            <textarea
              className="form-control font-monospace"
              style={{ "font-size": 14, height: "100px" }}
              rows="2"
              id="ruleResult"
              type="text"
              placeholder="rule result"
              value={ruleResult}
              readOnly
            />
            <label for="result">Rule result</label>
          </div>
        </div>
      </div>
      <div className="mt-3 mb-3">
        <div className="col-sm-6">
          <button className="btn btn-primary me-2" onClick={evaluateRule}>
            evaluate rule
          </button>
          <button className="btn btn-primary" onClick={onShowRuleForm}>
            create rule
          </button>
          {showRuleForm ? <RuleForm /> : null}
        </div>
      </div>
    </div>
  );
}

export default Builder;
