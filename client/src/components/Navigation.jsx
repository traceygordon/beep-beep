import { Link } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";


export default function Navigation({ setToken, token }) {
const navigate = useNavigate()

function handleClick(){
setToken("");
localStorage.removeItem("token");
navigate("/");

}

  return (
    <>

    <div className="navbar">
    <img className="main-img" src="/msb.webp" alt="Bus" />
       {token ? (<>
      <Link to={"/buses"}>
        <h2>Buses</h2>
      </Link>

      <Link to={"/account"}>
        <h2>Account</h2>
      </Link>

      <button className="logout-button" onClick={handleClick}>Log Out</button> </>
      ) : (
<>
      <Link to={"/"}>
        <h2>Log In</h2>
      </Link>

      <Link to={"/register"}>
        <h2>Register</h2>
      </Link>
      </>)
    
      } 
    </div>
    </>
  );
}
