import { useEffect, useState } from "react";
import { deleteUser } from "../api";

export default function Account({ token }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


useEffect(() => {
 async function getUserDetails(token) {
      try {
        const response = await fetch("http://localhost:3000/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

      const userData = await response.json();
      setUser(userData);
      setUsername(userData.username);
      setPassword("")
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  getUserDetails(token);
}, [token]);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleUpdate() {
      console.log("Updating user with ID:", user.id);
  
      try {
        const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            username: username, 
            password: password }),
        });
    
        console.log(`Updated user ${username} with pw ${password}`);
      } catch (err) {
        console.error(err);
      }
    }
  
    async function handleDelete() {
      try {
        await deleteUser(user.id);
      } catch (err) {
        console.error(err);
      }
    }



  return (
    <div className="info-container">
      <img className="user-img" src="/frizz.jpg" alt="Ms. Frizzle" />
      <h3>Username: {username}</h3>
      <label className="username">
        Update username:
        <input 
          type="text" 
          value={username} 
          onChange={handleUsernameChange} 
        />
      </label>
<br />
      <label className="password">
        Update password:
        <input 
          type="password" 
          value={password} 
          onChange={handlePasswordChange} 
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
  );
}
