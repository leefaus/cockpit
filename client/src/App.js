import React from "react";
import bootstrap from "bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Todo from "./components/todos/Todo";
import Application from "./components/applications/Application";
import Home from "./components/home/Home";
import Rules from "./components/rules/Rules";
import Builder from "./components/builder/Builder";
import "./App.css";

library.add(fab, fal);

const App = () => {
  return (
    <div className="container bg-light">
      <Router>
        <Switch>
          <Route path="/application/:applicationId">
            <Application />
          </Route>
          <Route path="/todo">
            <Todo />
          </Route>
          <Route path="/rules">
            <Rules />
          </Route>
          <Route path="/builder">
            <Builder />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
