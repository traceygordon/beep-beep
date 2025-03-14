const BASE_API = `http://localhost:3000/api`;

//USERS
export async function getUsers() {
  try {
    const response = await fetch(BASE_API + "/users");
    const json = await response.json();
    const result = json.data;
    return result.users;

  } catch (err) {
    console.error(err);
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
    const json = await response.json();
    const result = json.data;
    return result;

  } catch (err) {
    console.error(err);
  }}

export async function deleteUser(userId) {
  try {
    const response = await fetch(BASE_API + `/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = response.json();
    const result = json.data;
    return result;

  } catch (err) {
    console.error(err);
  }}


//BUSES
  export async function getBuses() {
    try {
      const response = await fetch(BASE_API + "/buses");
      const json = await response.json();
      const result = json.data;
      return result.buses;
  
    } catch (err) {
      console.error(err);
    }
  }
  
  export async function addBus(bus) {
    try {
      const response = await fetch(BASE_API + "/buses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bus),
      });
      const json = await response.json();
      const result = json.data;
      return result;
  
    } catch (err) {
      console.error(err);
    }}
  
  export async function deleteBus(busId) {
    try {
      const response = await fetch(BASE_API + `/users/${busId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = response.json();
      const result = json.data;
      return result;
  
    } catch (err) {
      console.error(err);
    }}