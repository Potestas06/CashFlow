// Component/Login.js
import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toggleModal } from "../Component/modal";

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
      document.getElementById("successfulLoginButton").click();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main
      ref={mainRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
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
          autoComplete="email"
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

      <button
        data-target="successfulLogin"
        onClick={toggleModal}
        style={{ display: "none" }}
        id="successfulLoginButton"
      />
      <dialog id="successfulLogin">
        <article>
          <h5>Login successful!</h5>
          <p>You are now logged in.</p>
          <button
            type="button"
            className="secondary"
            data-target="successfulLogin"
            onClick={(e) => {
              toggleModal(e);
              navigate("/");
            }}
          >
            Close
          </button>
        </article>
      </dialog>
    </main>
  );
};

export default Login;
