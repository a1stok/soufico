import React, { useState } from "react";
import { auth } from "../core/config/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
      } else {
        setError("");
        setMessage("Login successful!");
        navigate("/my-account", { state: { uid: user.uid } });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="glass-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="options">
              <button type="button" onClick={handlePasswordReset} className="link-button">
                Forgot Password?
              </button>
            </div>
            <button type="submit">Login</button>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
          <p>
            Don't have an account? <Link to="/register" id="register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
