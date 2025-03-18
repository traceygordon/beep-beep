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
    const response = await fetch(`${BASE_API}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    return response.json();
  } catch (err) {
    console.error("Error adding user:", err);
    throw err;
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");

    return data;
  } catch (error) {
    console.error("Login failed:", error);
    return { error: error.message };
  }
}

export async function getUserDetails(token) {
  try {
    const response = await fetch("http://localhost:3000/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    return response.json();
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw err;
  }
}

async function updateUser(userId, updatedData) {
  await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
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
    const response = await fetch(`${BASE_API}/buses`, {
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

async function updateBus(busId, updatedData) {
  await fetch(`/api/buses/${busId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
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
