import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
  const fetchApplications = async () => {
    const result = await axios.get("/api/applications");
    const apps = result.data;
    console.log(apps)
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
              {applications.map((application) => (
                <ul>
                  <h2>{application.name}</h2>
                  {application.components.map((component) => (
                    <li key={component._id}><a href={'component/' + component._id }>{component.name}</a></li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Home;
