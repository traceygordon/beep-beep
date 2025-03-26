import { Link } from "react-router-dom";

export default function Buses({ token }) {
  return token ? (
    <div className="school-container">
      <Link to="./pine-ridge" className="school-card pine-ridge">
        <img src="/pine-ridge.jpg" alt="Pine Ridge" className="school-img" />
        <h2>Pine Ridge</h2>
      </Link>

      <Link to="./walden" className="school-card walden">
        <img src="/walden.webp" alt="Walden" className="school-img" />
        <h2>Walden</h2>
      </Link>
    </div>
  ) : (
    <p>No Parking! You must be logged in to view this page</p>
  );
}