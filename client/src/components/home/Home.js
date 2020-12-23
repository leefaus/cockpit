import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
  const fetchApplications = async () => {
    const result = await axios.get("/api/applications");
    const apps = result.data;
    setApplications(apps);
    setLoading(false);
  };
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <React.Fragment>
          <div className="container">
            <div className="row mb-3">
              <h2>
                <FontAwesomeIcon icon={["fal", "browser"]} /> Applications
              </h2>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <ul>
                {applications.map((application) => (
                    <li key={application._id}><a href={'application/' + application._id}>{application.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Home;
