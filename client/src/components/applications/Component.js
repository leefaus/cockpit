import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import ReactJson from "react-json-view";
import moment from "moment"
import tz from "moment-timezone"


function Loading() {
  return <h1>Loading...</h1>;
}

function Event(props) {
  const event = props.event;
  const [collapsed, setCollapsed] = useState(true)
    
    function updateIcon() {
      setCollapsed(
        collapsed ? false : true,
      );
    }

    async function triggerWebhook() {
        // call https://spinnaker-gate.se.armory.io/webhooks/webhook/cockpit-build
        const result = await axios.post(`https://spinnaker-gate.se.armory.io/webhooks/webhook/cockpit-build`, {hello:"world"});
        console.log (result)
    }

  return (
    <div>
      <div className="card mb-2">
        <div
          className="card-header d-flex align-middle"
          data-bs-toggle="collapse"
          data-bs-target={`#details-${event._id}`}
          aria-expanded="false"
          aria-controls="collapseExample"
          onClick={updateIcon}
        >
          <FontAwesomeIcon
            icon={collapsed ? ["fal", "angle-right"] : ["fal", "angle-down"]}
            type="button"
            size="lg"
          />
          <span className="font-monospace ms-3 ">
            {event.headers["x-github-event"]}
          </span>
        </div>
        <div id={`details-${event._id}`} className="collapse">
          <div className="card-body">
            <h5 className="card-title">Headers</h5>
            <ReactJson
              className="card-text"
              src={event.headers}
              displayDataTypes="false"
              iconStyle="circle"
              collapsed="true"
              name="headers"
            />
            <h5 className="card-title mt-2">Body</h5>
            <ReactJson
              className="card-text"
              src={event.body}
              displayDataTypes="false"
              iconStyle="circle"
              collapsed="true"
              name="body"
            />
            <button className="btn btn-primary mt-3" onClick={triggerWebhook}>
              Start Build
            </button>
          </div>
          <div className="card-footer text-muted">
            {moment
              .tz(event.createdAt, "YYYY-MM-DD hh:mm:ss", "Europe/London")
              .clone()
              .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
              .fromNow()}
          </div>
        </div>
      </div>
      <div><ul>{event.rules.map((rule) => <li>{rule.title}</li>)}</ul></div>
    </div>
  );
}

function Release(props) {
  const release = props.release;
  console.log(`component: ${release._id}`);
  const style =
    "list-group-item d-flex justify-content-between align-items-center";
  const active = release.current ? `${style} active` : style;
  return (
    <li className={active}>
      {release.version}

      <span className="badge bg-success">{release.events.length}</span>
    </li>
  );
}

function Component() {
  const { componentId } = useParams();
  const fetchComponent = async () => {
    console.log("fetchApplication");
    const result = await axios.get(`/api/components/${componentId}`);
    const comp = result.data.components[0];
    console.log(comp)
    comp.releases.forEach((release) => {
      console.log(`Releases: ${release}`);
      if (release.current) {
        console.log(`Current Release: ${release}`);
        setActiveRelease({ id: release._id, events: release.events });
      }
    });
    setComponent(comp);
    setLoading(false);
  };
  const [component, setComponent] = useState({
    releases: [{ events: [] }],
  });
  const [activeRelease, setActiveRelease] = useState({
    id: String,
    events: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComponent();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <div className="container">
            <div className="row mb-3">
              <h2>
                <FontAwesomeIcon icon={["fal", "browser"]} /> {component.name}
              </h2>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-3">
                <h3>Releases</h3>
                <ul className="list-group">
                  {component.releases.map((release) => (
                    <Release key={release._id} release={release} />
                  ))}
                </ul>
              </div>
              <div className="col-9">
                <h3>Events</h3>
                {activeRelease.events.map((ev) => (
                  <Event key={ev._id} event={ev} />
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Component;
