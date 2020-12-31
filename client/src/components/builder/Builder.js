import React, { useEffect, useState } from "react";
import axios from "axios";
import jp from "jsonpath";
import ReactJson from "react-json-view";

function Builder() {
  const fetchEvents = async () => {
    const result = await axios.get("/api/events");
    const events = result.data;
    setEvents(events);
    setLoading(false);
  };
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  function evaluateQuery() {
    setEvaluation(jp.query(JSON.parse(event), query));
  }
    
    const loadEventData = async (id) => {
            const result = await axios.get(`/api/events/${id}`);
            const event = result.data;
        setEvent(JSON.stringify(event, undefined, 2));
    }

  return (
    <div className="container">
      <h1>JSONPath Builder</h1>
      <div className="row mb-3">
        <div className="col-sm-8">
          <input
            className="form-control"
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-sm-2">
          <button className="btn btn-primary" onClick={evaluateQuery}>
            evaluate
          </button>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-4">
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
      <div className="row mb-3">
        <div className="col-sm-6">
          <textarea
            className="form-control"
            rows="8"
            id="json"
            type="text"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </div>
        <div className="col-sm-4">
          <textarea
            className="form-control"
            rows="8"
            id="result"
            type="text"
                      value={evaluation}
                      readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default Builder;
