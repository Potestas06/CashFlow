import React from "react";

function Foot() {
  return (
    <div>
      <div role="group">
        {window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches ? (
          <a href="/">
            <img
              src={process.env.PUBLIC_URL + "/img/logo_dark.jpg"}
              alt="Cashflow"
              className="logo"
              style={{ width: "15%", height: "auto" }}
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
      </div>
    </div>
  );
}

export default Foot;
