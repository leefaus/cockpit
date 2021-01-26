import React, { useEffect, useState } from "react";
import axios from "axios";
import { JSONPath } from "jsonpath-plus";

function DataJSON(props) {
  let str = `{"${props.variable}": "${props.query}"}`;
  return (
    <div className="mt-3">
      <pre>{str}</pre>
    </div>
  );
}

function ActionBuilder() {
  const fetchEvents = async () => {
    const result = await axios.get("/api/events");
    const events = result.data;
    setEvents(events);
    setLoading(false);
  };
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("default");
  const [actionBody, setActionBody] = useState("");
  const [actionResult, setActionResult] = useState("");
  const [actionPath, setActionPath] = useState("");
  const [event, setEvent] = useState("");
  const [variable, setVariable] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(true);
  const [showDataJSON, setShowDataJSON] = useState(false);
  const onShowBuilder = () => setShowBuilder(false);
  const onShowDataJSON = () => setShowDataJSON(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  function evaluateQuery() {
    //example query: $..source.x-github-event
    //more complex query: $..commits[*][?(@property === "modified" || @property === "added" || @property === "removed")]
    var e = JSONPath({
      flatten: true,
      path: query,
      json: JSON.parse(event),
    });
    if (typeof e === "object" && e !== null) {
      e = JSON.stringify(e, undefined, 2);
    }
    setEvaluation(e);
  }

  async function testAction() {
    var bodyParsed = {};
    for (const [k, v] of Object.entries(JSON.parse(actionBody))) {
      if (v.startsWith("$")) {
        console.log(`in the if -> ${k}, ${v}`);
        var e = JSONPath({
          flatten: true,
          path: v,
          json: JSON.parse(event)
        });
        bodyParsed[k] = e[0];
      }
    }
    const result = await axios({
      method: action,
      url: actionPath,
      data: bodyParsed,
      headers: { "Content-Type": "application/json" },
    });
    setActionResult(JSON.stringify(result, undefined, 2));
  }

  const loadEventData = async (id) => {
    const result = await axios.get(`/api/events/${id}`);
    const event = result.data;
    setEvent(JSON.stringify(event, undefined, 2));
  };

  return (
    <div className="container">
      <h1>Action Builder</h1>
      <div className="row">
        <div className="col-md-12 mb-3">
          <div className="col-md-4">
            <select
              className="form-select"
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
              style={{ fontSize: 12, height: "300px" }}
              rows="16"
              id="json"
              type="text"
              placeholder="event json"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
            />
            <label htmlFor="json">Event JSON</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating">
            <textarea
              className="form-control font-monospace"
              style={{ fontSize: 14, height: "300px" }}
              rows="16"
              id="result"
              type="text"
              placeholder="query result"
              value={evaluation}
              readOnly
            />
            <label htmlFor="result">Query result</label>
          </div>
        </div>
        <div className="col-md-12 mt-3">
          <div className="input-group mb-3">
            <label
              className="input-group-text font-monospace"
              htmlFor="inputGroupSelect01"
            >
              var:
            </label>
            <input
              type="text"
              className="form-control font-monospace"
              aria-label="variable-query"
              placeholder="variable"
              style={{ maxWidth: "20%" }}
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
              className="btn btn-outline-secondary"
              type="button"
              onClick={evaluateQuery}
            >
              Test
            </button>
            <button
              className="btn btn-outline-secondary"
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
        <div className="col-md-12">
          <div className="input-group mb-3">
            <select
              className="form-select font-monospace"
              id="inputGroupSelect01"
              style={{ maxWidth: "10%" }}
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="default">Action</option>
              <option value="GET">GET</option>

              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              className="form-control font-monospace"
              aria-label="variable-query"
              placeholder="url"
              value={actionPath}
              onChange={(e) => setActionPath(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={testAction}
            >
              Test action
            </button>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <textarea
                  style={{ fontSize: 14, height: "200px" }}
                  rows="10"
                  className="form-control font-monospace"
                  id="action_body"
                  placeholder="Rule criteria"
                  value={actionBody}
                  onChange={(e) => setActionBody(e.target.value)}
                />
                <label htmlFor="action_body">Action body</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <textarea
                  style={{ fontSize: 14, height: "200px" }}
                  rows="10"
                  className="form-control font-monospace"
                  id="action_result"
                  placeholder="Rule criteria"
                  readOnly
                  value={actionResult}
                />
                <label htmlFor="action_body">Action result</label>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div>
              <button className="btn btn-primary">
                save action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionBuilder;
