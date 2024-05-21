import React from "react";

function Home() {
  return (
    <div className="container">
      <section>
        <hgroup style={{ textAlign: "center" }}>
          <div className="container">
            <img
              alt="ilustration"
              src={process.env.PUBLIC_URL + "/img/logo_dark.jpg"}
              className="max-width-100"
            ></img>
          </div>
        </hgroup>
      </section>
      <br />
      <br />
      <br />

      <section>
        <h3>What is Cashflow?</h3>
        <p>
          Cashflow is a simple budgeting app that helps you keep track of your
          money.
        </p>
      </section>
      <br />
      <br />

      <section>
        <h3>How does it work?</h3>
        <p>
          Just add your income and expenses to the app, and it will calculate
          your cashflow for you.
        </p>
      </section>
      <br />
      <br />

      <section>
        <h3>Why should I use Cashflow?</h3>
        <p>
          Cashflow is a great way to keep track of your money and make sure you
          are spending within your means.
        </p>
      </section>
      <br />
      <br />

      <section>
        <h3>How do I get started?</h3>
        <p>Just click on the "Add Transaction" button to get started!</p>
      </section>
    </div>
  );
}

export default Home;
