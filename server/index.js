const path = require("path");
const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../dbconfig");
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../verifyToken");
const verifyUser = require("../verify");
const app = express();
const fileupload = require("express-fileupload");
app.use(fileupload());

const port = 8000;
app.use(express.json());
// app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    `${process.env.FRONTEND_ORIGIN}`
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, auth-token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// get users
app.get("/api/users", verifyAdmin, (req, res) => {
  pool.query(
    `SELECT id, name, email, status, created_at, last_login, role FROM users`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

// register user
app.post("/api/users", (req, res) => {
  let { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `SELECT * FROM users
       WHERE email = $1`,
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result.rows);
        if (result.rows.length > 0) {
          res.status(400).send("Email already taken");
        } else {
          let hashedPassword = await bcrypt.hash(password, 10);
          // console.log(hashedPassword);
          const current_time = new Date();
          pool.query(
            `INSERT INTO users (name, email, password, last_login) 
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, last_login, role`,
            [name, email, hashedPassword, current_time],
            (err, r) => {
              if (err) {
                console.log(err);
              }
              const token = jwt.sign(
                { role: "user", email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
              // console.log(r.rows);
              res.status(200).send({ ...r.rows[0], token });
            }
          );
        }
      }
    );
  }
});

// login user
app.post("/api/auth/login", (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `SELECT * FROM users
       WHERE email = $1`,
      [email],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.rows.length > 0) {
          // console.log(result.rows);
          let { id, name, email, status, role } = result.rows[0];

          bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              if (status) {
                const current_time = new Date();
                pool.query(
                  `UPDATE users
                  SET last_login = $1
                  WHERE id = $2
                  RETURNING id, last_login`,
                  [current_time, id],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    // console.log(result.rows);
                    const token = jwt.sign(
                      { role, email },
                      process.env.TOKEN_KEY,
                      {
                        expiresIn: "2h",
                      }
                    );
                    res.send({ id, name, email, role, token });
                  }
                );
              } else {
                res.status(403).send("User blocked");
              }
            } else {
              res.status(401).send("Unauthorized");
            }
          });
        } else {
          res.status(401).send("Unauthorized");
        }
      }
    );
  }
});

// block user
app.post("/api/users/block", verifyAdmin, (req, res) => {
  let { id, status } = req.body;
  if (!id || !(typeof status === "boolean")) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `UPDATE users
         SET status = $1
         WHERE id = $2
         RETURNING id, status;`,
      [status, id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.rows.length > 0) {
          res.send("Ok");
        } else {
          res.status(404).send("Not found");
        }
      }
    );
  }
});

// set role
app.post("/api/users/role", verifyAdmin, (req, res) => {
  let { id, role } = req.body;
  if (!id || !role) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `UPDATE users
         SET role = $1
         WHERE id = $2
         RETURNING id, role;`,
      [role, id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.rows.length > 0) {
          res.send("Ok");
        } else {
          res.status(404).send("Not found");
        }
      }
    );
  }
});

// delete user
app.delete("/api/users/:id", verifyAdmin, (req, res) => {
  const id = req.params.id;
  pool.query(
    `DELETE
     FROM users
     WHERE id = $1
     RETURNING id, email;
    `,
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.rows.length > 0) {
        console.log(result.rows);
        res.status(202).send("Ok");
      }
    }
  );
});

// upload image
app.post("/api/upload", verifyUser, (req, res) => {
  let img;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  img = req.files.img;
  uploadPath = __dirname + "\\uploads\\" + img.name;
  img.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.query(
      `INSERT INTO uploads (image_url) 
       VALUES ($1)
       RETURNING id, image_url`,
      [img.name],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        // console.log(r.rows);
        res.status(200).send(r.rows[0]);
      }
    );
  });
});

// load image
app.get("/images/:id/:url", (req, res) => {
  const url = req.params.url;
  res.sendFile(path.join(__dirname, `./uploads/${url}`));
});

app.post("/api/collections", verifyUser, (req, res) => {
  const {
    userId,
    name,
    description,
    categoryId,
    imageId,
    checkbox_fields,
    integer_fields,
    string_fields,
  } = req.body;
  if (
    !userId ||
    !name ||
    !description ||
    !categoryId ||
    !imageId ||
    !checkbox_fields ||
    !integer_fields ||
    !string_fields
  ) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO collections (user_id, name, description, category_id ,image_id, checkbox_fields, integer_fields, string_fields) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, checkbox_fields`,
      [
        userId,
        name,
        description,
        categoryId,
        imageId,
        checkbox_fields,
        integer_fields,
        string_fields,
      ],
      (err, r) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Server Error");
        }
        // console.log(r.rows[0]);
        res.status(200).send("Ok");
      }
    );
  }
});

// get categories
app.get("/api/categories", (req, res) => {
  pool.query(`SELECT id, name FROM categories`, (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(result.rows);
    res.send(result.rows);
  });
});

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
