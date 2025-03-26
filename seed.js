require('dotenv').config();
const pg=require('pg');
const client=new pg.Client({connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const init = async () => {
    await client.connect();
  
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

  };

  init();