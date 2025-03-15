import { useState } from "react";
import Account from "./components/Account";
import Register from "./components/Register";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Buses from "./components/Buses";
import Header from "./components/Header";

function App() {
  //  const [token, setToken] = useState(localStorage.getItem("token") || "");


  return (
    <>
      <Header />
      <Navigation />
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/account" element={<Account />}/>

        <Route path="/buses" element={<Buses />}/>
        
    
      </Routes>
    </>
  );
}

export default App;
