import React from "react";

function Foot() {
  return (
    <footer className="container">
      <div
        role="group"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <a href="/" style={{ marginRight: "1rem" }}>
          <img
            src={
              window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
                ? process.env.PUBLIC_URL + "/img/logo_dark.jpg"
                : process.env.PUBLIC_URL + "/img/logo_light.jpg"
            }
            alt="Cashflow"
            className="logo"
            style={{ width: "15%", height: "auto" }}
          />
        </a>
        <p>© {new Date().getFullYear()} Cashflow</p>
      </div>
    </footer>
  );
}

export default Foot;
