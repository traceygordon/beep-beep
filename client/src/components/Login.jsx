import { useState } from "react";
import { loginUser } from "../api"; // You'll need to create this function

export default function Login({ setToken }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
      const result = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      console.log(result);
      setToken(result.token); // Store token for authentication

    } catch (error) {
      setError("Invalid credentials. Try again.");
    }
  }

  return (
    <>
      <h2>Login</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label>
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
        <label>
          Password:
          <input
            type="password"
            value={formData.password}
            onChange={(e) => {
              setPasswordError("");
              setFormData((prev) => ({ ...prev, password: e.target.value }));
            }}
          />
          {passwordError && <p>{passwordError}</p>}
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
