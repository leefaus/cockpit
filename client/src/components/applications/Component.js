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
      <div className="mb-3">
        <ul className="list-group list-group-flush">
          {event.rules.map((rule) => (
            <li className="list-group-item">
              <div>
                <span className="badge bg-light text-dark">rule:</span>{" "}
                {rule.ruleId.title} {" "}
                <span className="badge bg-light text-dark">action:</span>{" "}
                {rule.actionId.title}
              </div>
              <div></div>
              <nav className="mt-3">
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                  <a
                    class="nav-link active"
                    id="nav-home-tab"
                    data-bs-toggle="tab"
                    href="#nav-home"
                    role="tab"
                    aria-controls="nav-home"
                    aria-selected="true"
                  >
                    Details
                  </a>
                  <a
                    class="nav-link"
                    id="nav-profile-tab"
                    data-bs-toggle="tab"
                    href="#nav-profile"
                    role="tab"
                    aria-controls="nav-profile"
                    aria-selected="false"
                  >
                    Response{" "}
                    <span className="badge bg-success mx-2">{rule.status}</span>
                  </a>
                </div>
              </nav>
              <div className="tab-content mt-2" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="nav-home"
                  role="tabpanel"
                  aria-labelledby="nav-home-tab"
                >
                  <ReactJson
                    className="card-text"
                    src={rule.ruleId.criteria}
                    displayDataTypes="false"
                    iconStyle="circle"
                    collapsed="false"
                    name="rule"
                  />
                  <ReactJson
                    className="card-text"
                    src={rule.config}
                    displayDataTypes="false"
                    iconStyle="circle"
                    collapsed="true"
                    name="action"
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-profile"
                  role="tabpanel"
                  aria-labelledby="nav-profile-tab"
                >
                  <ReactJson
                    className="card-text"
                    src={rule.headers}
                    displayDataTypes="false"
                    iconStyle="circle"
                    collapsed="true"
                    name="headers"
                  />
                  <ReactJson
                    className="card-text"
                    src={rule.response}
                    displayDataTypes="false"
                    iconStyle="circle"
                    collapsed="true"
                    name="response"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Release(props) {
  const release = props.release;
  console.log(`release: ${release._id}`);
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
    const comp = result.data;
    console.log(`data => ${JSON.stringify(comp)}`)
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
