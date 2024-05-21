import React, { useRef, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Navigate } from "react-router-dom";

const Register = () => {
  const mainRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const setMinHeight = () => {
      if (!mainRef.current) return;
      mainRef.current.style.minHeight = `${window.innerHeight}px`;
    };
    setMinHeight();
    window.addEventListener("resize", setMinHeight);
    return () => {
      window.removeEventListener("resize", setMinHeight);
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
      await signInWithEmailAndPassword(auth, email, password);
      Navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main
      ref={mainRef}
      style={{
        minHeight: "100vh",
        maxWidth: "map.get(map.get($breakpoints, 'sm'), 'viewport')",
        flexDirection: "column",
        justifyContent: "center",
      }}
      className="container"
    >
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          aria-label="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </main>
  );
};

export default Register;
