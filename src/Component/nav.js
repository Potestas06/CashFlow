import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            {window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches ? (
              <a href="/">
                <img
                  src={process.env.PUBLIC_URL + "/img/logo_dark.jpg"}
                  alt="Cashflow"
                  className="logo"
                />
              </a>
            ) : (
              <a href="/">
                <img
                  src={process.env.PUBLIC_URL + "/img/logo_light.jpg"}
                  alt="Cashflow"
                  className="logo"
                />
              </a>
            )}
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
