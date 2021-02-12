import React from "react";
import bootstrap from "bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Todo from "./components/todos/Todo";
import Component from "./components/applications/Component";
import Home from "./components/home/Home";
import Rules from "./components/rules/Rules";
import RuleBuilder from "./components/builder/RuleBuilder";
import ActionBuilder from "./components/builder/ActionBuilder";
import "./App.css";

library.add(fab, fal);

const App = () => {
  return (
    <div className="container bg-light">
      <Router>
        <Switch>
          <Route path="/component/:componentId">
            <Component />
          </Route>
          <Route path="/todo">
            <Todo />
          </Route>
          <Route path="/rules">
            <Rules />
          </Route>
          <Route path="/rule-builder">
            <RuleBuilder />
          </Route>
          <Route path="/action-builder">
            <ActionBuilder />
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
