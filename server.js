import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client = new pg.Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:2182@localhost:5432/beep_beep_db",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Connect to the database
client.connect().catch((err) => console.error('Database connection error:', err));

app.use(express.json());
app.use(cors());

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
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
    res.send(response.rows);
  } catch (ex) {
    next(ex);
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
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/buses/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const SQL = `
          SELECT * FROM buses WHERE id=$1;
        `;
    const response = await client.query(SQL, [Number(id)]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/schools/pine-ridge", async (req, res, next) => {
  try {
    const result = await client.query(
      // `SELECT * FROM buses;`
      `SELECT * FROM buses WHERE schoolid=2;`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get("/api/schools/walden", async (req, res, next) => {
  try {
    const SQL = `
      SELECT * FROM buses 
      WHERE schoolid = (SELECT id FROM schools WHERE name = 'Walden');
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
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const SQL = `INSERT INTO users(username, password) VALUES($1, $2) RETURNING *`;
    const result = await client.query(SQL, [username, hashedPassword]);

    res.json(result.rows[0]);
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

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid username or password username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    next(error);
  }
});

app.post("/api/buses/register", async (req, res, next) => {
  try {
    const { number, row, schoolid } = req.body;
    const SQL = `INSERT INTO buses(number, row, schoolid) VALUES($1, $2, $3) RETURNING *`;
    const result = await client.query(SQL, [number, row, schoolid]);

    res.json(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

//PATCH
app.patch("/api/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const SQL = `
    UPDATE users 
      SET username = COALESCE($1, username)
    WHERE id = $2
    RETURNING *`;
    const result = await client.query(SQL, [username, id]);

    res.send(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

app.patch("/api/buses/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { number, row } = req.body;
    const SQL = `
       UPDATE buses 
      SET number = COALESCE($1, number), 
          row = COALESCE($2, row)
      WHERE id = $3
      RETURNING *`;
    const result = await client.query(SQL, [number, row, id]);

    res.send(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

//DELETE
app.delete("/api/users/:id", async (req, res, next) => {
  const { id } = req.params;
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
  const { id } = req.params;
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

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
);

// create your init function
const init = async () => {
  // await client.connect();

  const SQL = `
DROP TABLE IF EXISTS buses CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE buses (
  id SERIAL PRIMARY KEY,
  number VARCHAR(50) NOT NULL,
  row INTEGER,
  schoolid INTEGER REFERENCES schools(id) ON DELETE CASCADE
);


INSERT INTO schools (name) VALUES ('Walden'), ('Pine Ridge');

INSERT INTO buses (number, row, schoolid) VALUES ('101', 2, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('102', 3, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('103', 1, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('104', 4, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('105', 2, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('106', 1, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('107', 3, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('108', 4, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('109', 2, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('110', 1, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('111', 4, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('112', 3, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('113', 2, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('114', 1, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('115', 3, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('116', 4, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('117', 1, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('118', 3, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('119', 2, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('120', 4, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('121', 1, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('122', 3, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('123', 4, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('124', 2, 1);
INSERT INTO buses (number, row, schoolid) VALUES ('125', 1, 1);


INSERT INTO buses (number, row, schoolid) VALUES ('201', 2, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('202', 1, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('203', 3, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('204', 2, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('205', 1, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('206', 3, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('207', 2, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('208', 1, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('209', 3, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('210', 2, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('211', 1, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('212', 3, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('213', 2, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('214', 1, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('215', 3, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('216', 2, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('217', 1, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('218', 3, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('219', 2, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('220', 1, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('221', 3, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('222', 2, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('223', 1, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('224', 3, 2);
INSERT INTO buses (number, row, schoolid) VALUES ('225', 2, 2);
`;

  await client.query(SQL);

  // const port = process.env.PORT || 3000;

  // app.listen(port, () => console.log(`listening on port ${port}`));
};

async function startServer() {
  // await client.connect();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
}

startServer();

