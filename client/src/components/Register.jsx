import { useState } from "react";
import { addUser } from "../api";

export default function Register({ setToken }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (formData.username.length < 1) {
      setNameError(
        "Stop! You need a username to get on the bus."
      );
    } else if (formData.password.length < 1) {
      setPasswordError(
        "Slow down. You need a password to roll on."
      );
    } else
      try {
        const response = await addUser({
              username: formData.username,
              password: formData.password,
            })
        const result = await response.json();
        console.log(result);
        setToken(result.token);

      } catch (error) {
        setError(error.message);
      }
  }

  return (
    <>
      <h2>Register</h2>
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
