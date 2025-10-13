import React, { useState } from "react";
import { auth } from "../core/config/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Link } from "react-router-dom";
import "../styles/pages/RegisterPage.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      setMessage("Account created successfully! Please check your email for verification.");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="glass-container">
        <div className="register-box">
          <h2>Create an Account</h2>
          <form onSubmit={handleRegister}>
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
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="register-button">Register</button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <p>
            Already have an account? <Link to="/login" id="login-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
