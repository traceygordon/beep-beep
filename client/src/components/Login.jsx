import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login({ setToken }) {
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
      const result = await loginUser(formData);
      console.log(result);
      if (result.token) {
        setToken(result.token);
        localStorage.setItem("token", result.token);
        setError(null);
        navigate("/buses");
      } else {
        setError("Back up. The username or password is not recognized.");
      }
    } catch (error) {
      setError("Back up. The username or password is not recognized.");
    }
  }

  return (
    <>
    <div>
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
        <br />
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
        <br />
        <button type="submit">Submit</button>
      </form>
      </div>
      <div>
      <Link to={"/register"}>
        <p>or register</p>
      </Link>
      </div>
    </>
  );
}
