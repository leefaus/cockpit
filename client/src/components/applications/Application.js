import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Application() {
    const { applicationId } = useParams();
    const [application, setApplication] = useState([]);

    useEffect(() => {
        console.log("calling axios!");
        axios
            .get(`/api/applications/${applicationId}`)
            .then((res) => {
                console.log(res);
                if (res.data) {
                    setApplication(res.data);
                }
            })
            .catch((err) => console.log(err));
    }, [applicationId]);

  return (
    <div>
      <h1>application/{application.name}</h1>
    </div>
  );
}

export default Application;
