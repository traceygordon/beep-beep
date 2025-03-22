import { useState } from "react";
import { addUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register({ setToken }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.username.length < 1) {
      setNameError("Stop! You need a username to get on the bus.");
      return;
    }
    if (formData.password.length < 1) {
      setPasswordError("Slow down. You need a password to roll on.");
      return;
    }

    try {
      const result = await addUser({
        username: formData.username,
        password: formData.password,
      });
      setToken(result.token);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="info-container">
      <h2>Register</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label className="username">
          Username:
          <input
            type="text"
            value={formData.username}
            onChange={(e) => {
              setNameError("");
              setFormData((prev) => ({ ...prev, username: e.target.value }));
            }}
          />
          {nameError && <p>{nameError}</p>}
        </label>
        <br />
        <label className="password">
          Password:
          <input
            type="password"
            size="21"
            value={formData.password}
            onChange={(e) => {
              setPasswordError("");
              setFormData((prev) => ({ ...prev, password: e.target.value }));
            }}
          />
          {passwordError && <p>{passwordError}</p>}
        </label>
        <br />
        <button className="submit-button" type="submit">
          Go to Login
        </button>
      </form>
    </div>
  );
}
