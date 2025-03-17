import { useState } from "react";
import Account from "./components/Account";
import Register from "./components/Register";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Buses from "./components/Buses";
import Header from "./components/Header";
import WaldenBuses from "./components/WaldenBuses";
import PineRidgeBuses from "./components/PineRidgeBuses";


function App() {
   const [token, setToken] = useState(localStorage.getItem("token") || "");


  return (
    <>
      <Header />
      <Navigation setToken={setToken} token={token}/>
      <Routes>

        <Route path="/login" element={<Login setToken={setToken} token={token} />} />

        <Route path="/register" element={<Register setToken={setToken}/>} />

        <Route path="/account" element={<Account token={token} />}/>

        <Route path="/buses" element={<Buses token={token} />}/>

        <Route path="/buses/pine-ridge" element={<PineRidgeBuses />} />
        
        <Route path="/buses/walden" element={<WaldenBuses />} />
      
    
      </Routes>
    </>
  );
}

export default App;
