import { deleteBus } from "../api";

export default function SingleBus({ bus, removeBus }) {

  async function handleDelete() {
    try {
      const response = await deleteBus(bus.id); // ✅ Pass the correct bus ID
      if (!response.ok) {
        throw new Error("Failed to delete bus");
      }

      const result = await response.json();
      console.log("Bus deleted:", result);

      if (removeBus) {
        removeBus(bus.id);
      }
    } catch (err) {
      console.error("Error deleting bus:", err);
    }
  }

  return (
    <div className="bus-card">
      <img className="img" src="/lilbus.webp" alt="Bus" />
      <h1>{bus.number}</h1>
      <h2>{bus.schoolId}</h2>
      <button className="button" onClick={handleDelete}>
        Delete Bus
      </button>
    </div>
  );
}
