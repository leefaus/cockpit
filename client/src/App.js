import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Todo from "./components/todos/Todo";
import Application from "./components/applications/Application";
import "./App.css";

function Home() {
  return <h2>Home</h2>;
}

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
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
