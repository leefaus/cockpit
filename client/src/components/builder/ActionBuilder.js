import React, { useEffect, useState } from "react";
import axios from "axios";
import { JSONPath } from "jsonpath-plus";

function ActionBuilder() {
    return (
      <div className="col-md-12">
        <div class="input-group mb-3">
          <select
            className="form-select font-monospace"
            id="inputGroupSelect01"
            style={{ "max-width": "10%" }}
          >
            <option selected>Action</option>
            <option value="GET">GET</option>

            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="text"
            className="form-control font-monospace"
            aria-label="variable-query"
            placeholder="url"
          />
          <button class="btn btn-outline-secondary" type="button">
            Test action
          </button>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <textarea
                style={{ "font-size": 14, height: "200px" }}
                rows="10"
                className="form-control font-monospace"
                id="action_body"
                placeholder="Rule criteria"
              />
              <label for="action_body">Action body</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <textarea
                style={{ "font-size": 14, height: "200px" }}
                rows="10"
                className="form-control font-monospace"
                id="action_result"
                placeholder="Rule criteria"
                readOnly
              />
              <label for="action_body">Action result</label>
            </div>
          </div>
        </div>
      </div>
    );
}