import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(redirect);
  }, [navigate]);

  return (
    <div className="container">
      <section>
        <img alt="404 Not Found" src="https://http.cat/404" />
      </section>
      <p>Sorry, the page you are looking for could not be found.</p>
      <p>You will be redirected to the homepage in 10 seconds.</p>
    </div>
  );
};

export default NotFound;
