import { Link } from "react-router-dom";
import React from "react";

export default function Navigation({ token }) {
  return (
    <div className="navbar">
      <Link to={"/buses"}>
        <h2>Buses</h2>
      </Link>

      <Link to={"/account"}>
        <h2>Account</h2>
      </Link>

      <Link to={"/login"}>
        <h2>Log In</h2>
      </Link>

      <Link to={"/register"}>
        <h2>Register</h2>
      </Link>
    </div>
  );
}
