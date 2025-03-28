import { useEffect, useState } from "react";
import { deleteUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Account({ setToken, token }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDetails(token) {
      try {
        const response = await fetch("https://beep-beep.onrender.com/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await response.json();
        setUser(userData);
        setUsername(userData.username);
        setPassword("");
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    getUserDetails(token);
  }, [token]);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  async function handleUpdate() {
    try {
      const response = await fetch(
        `https://beep-beep.onrender.com/api/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    try {
      await deleteUser(user.id);
      setToken("");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    token ? (
    <div className="info-container">
      <div className="profile">
        <img className="user-img" src="/frizz.jpg" alt="Ms. Frizzle" />
      </div>
      <div className="user-info">
        <p>
          <strong>Username:</strong> {username}
        </p>
        <label className="username">
          Update username:
          <br />
          <input
            type="text"
            size="15"
            value={username}
            onChange={handleUsernameChange}
          />
        </label>
        <br />
        <button className="update-button" onClick={handleUpdate}>
          Update account
        </button>
        <br />
        <button className="delete-button" onClick={handleDelete}>
          Delete account
        </button>
      </div>
    </div>) : (<p>No Parking! You must be logged in to view this page</p>)
  );
}
