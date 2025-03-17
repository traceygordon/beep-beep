import { useEffect, useState } from "react";
import { getUserDetails } from "../api"; 
import { useNavigate } from "react-router-dom";

export default function Account({ token }) {
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

  function usernameChange(){
    const username = window.prompt("Enter your username","");
    

  }

  function passwordChange(){
    const password = window.prompt("Enter your password","");
  }


  if (!user) return <p>Loading account details...</p>;

  return (
    <div className="account-container">
      <h2>Welcome, {user.username}!</h2>
      <img className="user-image" src="/frizz.jpg" alt="user-image" />
      <p><strong>Username:</strong> {user.username}</p>
      <button onClick={usernameChange()}>change username</button>
      <br />
      <button onClick={passwordChange()}>change password</button>
 
    </div>
  );
}
