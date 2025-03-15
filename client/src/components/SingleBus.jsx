import { deleteBus } from "../api";

export default function SingleBus({bus}) {

  async function handleDelete() {
    try {
      const response = await deleteBus
      const result = response.json();
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="buses">
     <img className="img" src="lilbus.webp" />
      <h1>{bus.number}</h1>
        <button className="button " onClick={handleDelete}>
          Delete Bus
        </button>
    </div>
  );
}