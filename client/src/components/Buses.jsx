import PineRidgeBuses from "./PineRidgeBuses";
import WaldenBuses from "./WaldenBuses";
import { Link } from "react-router-dom";

export default function Buses() {
  return (
    <div className="school-cards">
        <Link to={"./pine-ridge"}>
          <h2>Pine Ridge</h2>
        </Link>
  
        <Link to={"./walden"}>
          <h2>Walden</h2>
        </Link>
    </div>)
}
