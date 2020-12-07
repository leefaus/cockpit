import React, { Component } from "react";
import axios from "axios";

class Input extends Component {
  state = {
    action: "",
  };

  addTodo = () => {
    const task = { action: this.state.action };

    if (task.action && task.action.length > 0) {
      axios
        .post("/api/todos", task)
        .then((res) => {
          if (res.data) {
            this.props.getTodos();
            this.setState({ action: "" });
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("input field required");
    }
  };

  handleChange = (e) => {
    this.setState({
      action: e.target.value,
    });
  };

  render() {
    let { action } = this.state;
    return (
      <div className="row mb-3">
        <div className="col-sm-1">
          <input type="text" className="form-control-plaintext" id="staticEmail2" value="Todo" readOnly />
        </div>
        <div className="col-sm-4">
          <input
            className="form-control"
            id="todo"
            type="text"
            onChange={this.handleChange}
            value={action}
          />
        </div>
        <div className="col-sm-2">
          <button className="btn btn-primary" onClick={this.addTodo}>
            add todo
          </button>
        </div>
      </div>
    );
  }
}

export default Input;
