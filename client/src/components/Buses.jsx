import { useState, useEffect } from "react";
import { getBuses } from "../api/index.js";
import SingleBus from "./SingleBus.jsx";

export default function Buses({token}) {
    const [buses, setBuses] = useState([]);
    
    async function allBuses() {
        const busData = await getBuses();
        setBuses(busData);
        console.log(busData)
      }
    
      useEffect(() => {
        allBuses(buses);
      }, []);

    return (
        <div className="article">
        
          <SingleBus
            // key={bus.id}
            // bus={bus.number}
            // pageName={"buses"}
            // busData={busData}
            token={token}
          />
        
      </div>
  )
  };