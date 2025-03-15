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
    const response = await client.query(SQL, [`${id}`]);

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

app.get("/api/buses/pine-ridge", async (req, res, next) => {
  try {
    const result = await client.query(
      `SELECT * FROM buses WHERE schoolId = (SELECT id FROM schools WHERE name = 'Pine Ridge')`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});


app.get("/api/buses/walden", async (req, res, next) => {
  try {
    const SQL = `
      SELECT * FROM buses 
      WHERE schoolId = (SELECT id FROM schools WHERE name = 'Walden')
    `;
    const result = await client.query(SQL);
    res.json(result.rows);
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
    const { number, schoolId } = req.body;
    const SQL = `INSERT INTO buses(number, schoolId) VALUES($1, $2) RETURNING *`;
    const result = await client.query(SQL, [number, schoolId]);

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
DROP TABLE IF EXISTS schools_buses;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS schools;

CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE buses (
  id SERIAL PRIMARY KEY,
  number VARCHAR(50) NOT NULL,
  schoolId INTEGER REFERENCES schools(id)
);

CREATE TABLE schools_buses (
  id SERIAL PRIMARY KEY,
  schoolId INTEGER REFERENCES schools(id),
  busId INTEGER REFERENCES buses(id)
);

INSERT INTO schools (name) VALUES ('Walden'), ('Pine Ridge');

INSERT INTO buses (number, schoolId) VALUES ('101', 1);
INSERT INTO buses (number, schoolId) VALUES ('102', 1);
INSERT INTO buses (number, schoolId) VALUES ('103', 1);
INSERT INTO buses (number, schoolId) VALUES ('104', 1);
INSERT INTO buses (number, schoolId) VALUES ('105', 1);
INSERT INTO buses (number, schoolId) VALUES ('106', 1);
INSERT INTO buses (number, schoolId) VALUES ('107', 1);
INSERT INTO buses (number, schoolId) VALUES ('108', 1);
INSERT INTO buses (number, schoolId) VALUES ('109', 1);
INSERT INTO buses (number, schoolId) VALUES ('110', 1);
INSERT INTO buses (number, schoolId) VALUES ('111', 1);
INSERT INTO buses (number, schoolId) VALUES ('112', 1);
INSERT INTO buses (number, schoolId) VALUES ('113', 1);
INSERT INTO buses (number, schoolId) VALUES ('114', 1);
INSERT INTO buses (number, schoolId) VALUES ('115', 1);
INSERT INTO buses (number, schoolId) VALUES ('116', 1);
INSERT INTO buses (number, schoolId) VALUES ('117', 1);
INSERT INTO buses (number, schoolId) VALUES ('118', 1);
INSERT INTO buses (number, schoolId) VALUES ('119', 1);
INSERT INTO buses (number, schoolId) VALUES ('120', 1);
INSERT INTO buses (number, schoolId) VALUES ('121', 1);
INSERT INTO buses (number, schoolId) VALUES ('122', 1);
INSERT INTO buses (number, schoolId) VALUES ('123', 1);
INSERT INTO buses (number, schoolId) VALUES ('124', 1);
INSERT INTO buses (number, schoolId) VALUES ('125', 1);

INSERT INTO buses (number, schoolId) VALUES ('201', 2);
INSERT INTO buses (number, schoolId) VALUES ('202', 2);
INSERT INTO buses (number, schoolId) VALUES ('203', 2);
INSERT INTO buses (number, schoolId) VALUES ('204', 2);
INSERT INTO buses (number, schoolId) VALUES ('205', 2);
INSERT INTO buses (number, schoolId) VALUES ('206', 2);
INSERT INTO buses (number, schoolId) VALUES ('207', 2);
INSERT INTO buses (number, schoolId) VALUES ('208', 2);
INSERT INTO buses (number, schoolId) VALUES ('209', 2);
INSERT INTO buses (number, schoolId) VALUES ('210', 2);
INSERT INTO buses (number, schoolId) VALUES ('211', 2);
INSERT INTO buses (number, schoolId) VALUES ('212', 2);
INSERT INTO buses (number, schoolId) VALUES ('213', 2);
INSERT INTO buses (number, schoolId) VALUES ('214', 2);
INSERT INTO buses (number, schoolId) VALUES ('215', 2);
INSERT INTO buses (number, schoolId) VALUES ('216', 2);
INSERT INTO buses (number, schoolId) VALUES ('217', 2);
INSERT INTO buses (number, schoolId) VALUES ('218', 2);
INSERT INTO buses (number, schoolId) VALUES ('219', 2);
INSERT INTO buses (number, schoolId) VALUES ('220', 2);
INSERT INTO buses (number, schoolId) VALUES ('221', 2);
INSERT INTO buses (number, schoolId) VALUES ('222', 2);
INSERT INTO buses (number, schoolId) VALUES ('223', 2);
INSERT INTO buses (number, schoolId) VALUES ('224', 2);
INSERT INTO buses (number, schoolId) VALUES ('225', 2);

`;

  await client.query(SQL);

  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`listening on port ${port}`));
};

// init function invocation
init();