// Component/Login.js
import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const mainRef = useRef();
  const navigate = useNavigate();
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/");
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
      <h1>Sign in</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          aria-label="Email"
          autocomplete="email"
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
        <fieldset>
          <label htmlFor="remember">
            <input
              type="checkbox"
              role="switch"
              id="remember"
              name="remember"
            />
            Remember me
          </label>
        </fieldset>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </main>
  );
};

export default Login;
