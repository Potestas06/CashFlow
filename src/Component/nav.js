import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <strong>Cashflow</strong>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Login">Login</Link>
          </li>
        </ul>
      </nav>
      <br />
      <br />
    </div>
  );
}

export default Nav;
