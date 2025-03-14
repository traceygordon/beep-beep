import { Link } from "react-router-dom";
import React from "react";

//add {token, setToken}
export default function Navigation() {
//   function handleClick() {
//     setToken("");
//     localStorage.setItem("token", "");
//   }

  return (
    <div className="navbar">
      <Link to={"/buses"}>
        <h2>Buses</h2>
      </Link>

      <Link to={"/account"}>
        <h2>Account</h2>
      </Link>

      {/* {!token ? (
        <> */}
         <Link to={"/login"}>
            <h2>Log In</h2>
          </Link>

          <Link to={"/register"}>
            <h2>Register</h2>
          </Link>
          </div> 
          
        //   </>
    //   ) : (
    //     <Link to={"/account"} onClick={handleClick}>
    //       <h2>Log out</h2>
    //     </Link>
    //   )
    // }
    // </div>
  );
}