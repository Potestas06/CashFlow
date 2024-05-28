import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function Nav() {
  const navigate = useNavigate();

  const logout = () => {
    auth.signOut();
    alert("Logout successful!");
    navigate("/Login");
  };

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
            <Link to="/Manage">Manage</Link>
          </li>
          <li>
            <details className="dropdown">
              <summary>Account</summary>
              <ul dir="rtl">
                {auth.currentUser ? (
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                ) : (
                  <li>
                    <Link to="/Login">Login</Link>
                  </li>
                )}
                <li>
                  <a href="/404">Profile</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
      <br />
      <br />
    </div>
  );
}

export default Nav;
