import { useEffect, useState } from "react";
import { getUserDetails } from "../api"; // Assume this API function fetches user data
import { useNavigate } from "react-router-dom";

export default function Account({ token, setToken }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUserDetails(token);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    if (token) {
      fetchUser();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (!user) return <p>Loading account details...</p>;

  return (
    <div className="account-container">
      <h2>Welcome, {user.username}!</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
