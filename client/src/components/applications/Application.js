import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import ReactJson from "react-json-view";
import moment from "moment"


function Loading() {
  return <h1>Loading...</h1>;
}

function Event(props) {
  const event = props.event;
    const [collapsed, setCollapsed] = useState(true)
    
    function updateIcon() {
        setCollapsed(collapsed ? false : true)
    }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center position-relative">
        <button type="button" class="btn btn-success btn-sm" style={{ width: 200 }}>
          {event.source["x-github-event"]}
        </button>
        <span class="position-absolute top-0 start-0 badge border border-light rounded-circle bg-light p-1">
          <FontAwesomeIcon icon={["fab", "github"]} size="2x" color="black" />
        </span>

        <h3>
          <FontAwesomeIcon
            icon={
              collapsed
                ? ["fal", "angle-double-down"]
                : ["fal", "angle-double-up"]
            }
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#details"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={updateIcon}
          />
        </h3>
      </div>
      <div id="details" className="collapse">
        <div className="card-body">
          <h5 className="card-title">Headers</h5>
          <ReactJson
            className="card-text"
            src={event.source}
            displayDataTypes="false"
            iconStyle="circle"
            name="headers"
          />
          <h5 className="card-title mt-2">Body</h5>
          <ReactJson
            className="card-text"
            src={event.nested}
            displayDataTypes="false"
            iconStyle="circle"
            collapsed="true"
            name="body"
          />
          <a href="#" className="btn btn-primary mt-3">
            Start Build
          </a>
        </div>
        <div className="card-footer text-muted">
          {moment(event.createdAt, "YYYY-MM-DD hh:mm:ss").fromNow()}
        </div>
      </div>
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

function Application() {
  const { applicationId } = useParams();
  const fetchApplication = async () => {
    console.log("fetchApplication");
    const result = await axios.get(`/api/applications/${applicationId}`);
    const app = result.data;
    app.releases.forEach((release) => {
      console.log(`Releases: ${release}`);
      if (release.current) {
        console.log(`Current Release: ${release}`);
        setActiveRelease({ id: release._id, events: release.events });
      }
    });
    setApplication(app);
    setLoading(false);
  };
  const [application, setApplication] = useState({
    releases: [{ events: [] }],
  });
  const [activeRelease, setActiveRelease] = useState({
    id: String,
    events: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
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
                <FontAwesomeIcon icon={["fal", "browser"]} /> application/
                {application.name}
              </h2>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-3">
                <h3>Releases</h3>
                <ul className="list-group">
                  {application.releases.map((release) => (
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

export default Application;
