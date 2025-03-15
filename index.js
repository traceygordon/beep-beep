// imports here
express = require("express");
const path = require("path");
const pg = require("pg");
const app = express();
const cors = require("cors")
const jwt = require("jsonwebtoken");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://postgres:2182@localhost:5432/beep_beep_db"
);
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";


app.use(express.json());
app.use(cors());

// static routes here
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

//Verify JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Access denied" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// app routes here
//GETS
app.get("/api/users", async (req, res, next) => {
  try {
    const SQL = `
          SELECT * FROM users;
        `;
    const response = await client.query(SQL);
    console.log(response);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/me", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const SQL = "SELECT id, username FROM users WHERE id = $1";
    const response = await client.query(SQL, [/* userId from token */]);

    if (response.rows.length === 0) return res.status(404).json({ error: "User not found" });

    res.json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.get("/api/users/me", authenticateToken, async (req, res, next) => {
  try {
    const SQL = "SELECT id, username FROM users WHERE id = $1";
    const result = await client.query(SQL, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});


app.get("/api/buses", async (req, res, next) => {
  try {
    const SQL = `
          SELECT * FROM buses;
        `;
    const response = await client.query(SQL);
    console.log(response);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

//POSTS
app.post("/api/users/register", async (req, res, next) => {
  try {  
    const {username, password} = req.body;
    const SQL = 
    `INSERT INTO users(username, password) 
    VALUES($1, $2) 
    RETURNING *`;
    const result = await client.query(
      SQL,
   [username,password]);

    res.send(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const SQL = "SELECT * FROM users WHERE username = $1";
    const result = await client.query(SQL, [username]);
    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    next(error);
  }
});

app.post("/api/buses", async (req, res, next) => {
  try {  
    const { number } = req.body;
    const SQL = `INSERT INTO buses(number) VALUES($1) RETURNING *`;
    const result = await client.query(SQL, [number]);

    res.json(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});


//PATCH
app.patch("/api/users/:id", async (req, res, next) => {
  try {  
    const {id} = req.params;
    const {username, password} = req.body;
    const SQL = 
    `UPDATE users 
    SET username=$1, password=$2
    WHERE id = $3
    RETURNING *`;
    const result = await client.query(
      SQL,
   [username,password, id]);

    res.send(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

app.patch("/api/buses/:id", async (req, res, next) => {
  try {  
    const {id} = req.params;
    const {number} = req.body;
    const SQL = 
    `UPDATE buses 
    SET number=$1
    WHERE id = $2
    RETURNING *`;
    const result = await client.query(
      SQL,
   [number, id]);

    res.send(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

//DELETE
app.delete("/api/users/:id", async (req, res, next) => {
  const {id} = req.params;
  try {  
  const SQL = `
    DELETE FROM users
    WHERE id = $1
  `;
  await client.query(SQL, [id]);
  res.sendStatus(204);
} catch (ex) {
  next(ex);
}
});

app.delete("/api/buses/:id", async (req, res, next) => {
  const {id} = req.params;
  try {  
  const SQL = `
    DELETE FROM buses
    WHERE id = $1
  `;
  await client.query(SQL, [id]);
  res.sendStatus(204);
} catch (ex) {
  next(ex);
}
});


// create your init function
const init = async () => {
  await client.connect();

  const SQL = `
        DROP TABLE IF EXISTS users_buses;
        DROP TABLE IF EXISTS buses;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(50) NOT NULL
        );
  
        CREATE TABLE buses (
          id SERIAL PRIMARY KEY,
          number VARCHAR(50) NOT NULL
        );

        CREATE TABLE users_buses (
        id SERIAL PRIMARY KEY,
        busId INTEGER REFERENCES buses(id),
        userId INTEGER REFERENCES users(id)
      );
    
     INSERT INTO users(username, password) VALUES('Sylvia', 'pw');
     INSERT INTO users(username, password) VALUES('Tracey', 'pw');
     INSERT INTO users(username, password) VALUES('Matt', 'pw');

     INSERT INTO buses(number) VALUES(407);
     INSERT INTO buses(number) VALUES(300);
     INSERT INTO buses(number) VALUES(19);

    `;

  await client.query(SQL);

  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`listening on port ${port}`));
};

// init function invocation
init();