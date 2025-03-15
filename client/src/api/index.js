const BASE_API = "http://localhost:3000/api";


// USERS
export async function getUsers() {
  try {
    const response = await fetch(BASE_API + "/users");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const users = await response.json();
    return users;
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}


export async function addUser(user) {
  try {
    const response = await fetch(BASE_API + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error("Error adding user:", err);
  }
}

export async function deleteUser(userId) {
  try {
    const response = await fetch(BASE_API + `/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error("Error deleting user:", err);
  }
}

// BUSES
export async function getBuses() {
  try {
    const response = await fetch(BASE_API + "/buses");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const buses = await response.json(); 
    console.log("Fetched buses:", buses);

    return buses;
  } catch (err) {
    console.error("Error fetching buses:", err);
    return [];
  }
}


export async function addBus(bus) {
  try {
    const response = await fetch(`${BASE_API}/buses`, { // ✅ Ensure BASE_API is correct
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bus),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const json = await response.json();
    return json;
  } catch (err) {
    console.error("Error adding bus:", err);
  }
}


export async function deleteBus(busId) {
  try {
    const response = await fetch(BASE_API + `/buses/${busId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error("Error deleting bus:", err);
  }
}
