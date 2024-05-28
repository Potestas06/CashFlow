import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Manage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return unsubscribe;
  }, [navigate]);

  return (
    <div className="container">
      <h1>Manage</h1>
      <p>Only authenticated users can access this page.</p>
    </div>
  );
};

export default Manage;
