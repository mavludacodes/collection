const path = require("path");
const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../dbconfig");
var cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../verifyToken");
const verifyUser = require("../verify");
const app = express();
const fileupload = require("express-fileupload");
app.use(fileupload({ useTempFiles: true }));

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../client/build")));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

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

// upload image local
app.post("/api/test", verifyUser, (req, res) => {
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

// upload image cloud
app.post("/api/upload", (req, res) => {
  let img;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  img = req.files.img;
  cloudinary.uploader
    .upload(img.tempFilePath)
    .then((result) => {
      pool.query(
        `INSERT INTO uploads (image_url, url)
         VALUES ($1, $2)
         RETURNING id, image_url, url`,
        [img.name, result.url],
        (err, r) => {
          if (err) {
            console.log(err);
          }
          // res.status(200).send(result);
          res.status(200).send(r.rows[0]);
        }
      );
    })
    .catch((err) => {
      if (err) return res.status(500).send(err);
    });
});

// load image cloud
app.get("/images/:id/:url", (req, res) => {
  const id = req.params.id;
  pool.query(`SELECT * FROM uploads WHERE id = $1`, [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect(result.rows[0].url);
  });
});

// load image local
app.get("/test/:id/:url", (req, res) => {
  const url = req.params.url;
  res.sendFile(path.join(__dirname, `./uploads/${url}`));
});

// post collection
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
       RETURNING id, name`,
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
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// delete collection
app.delete("/api/collections/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  pool.query(
    `DELETE
     FROM collections
     WHERE id = $1
     RETURNING id, name;
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

// get collection by userId
app.get("/api/collections", (req, res) => {
  let userId = req.query.userId;
  pool.query(
    `SELECT collections.id, collections.name, collections.description, collections.created_at, collections.category_id, collections.checkbox_fields, collections.string_fields, collections.integer_fields, collections.user_id, 
     collections.image_id, uploads.image_url
    FROM collections JOIN uploads ON collections.image_id = uploads.id WHERE collections.user_id =$1`,
    [userId],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result.rows);

      res.send(result.rows);
    }
  );
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

// post string-fields
app.post("/api/string-fields", verifyUser, (req, res) => {
  let { name } = req.body;
  if (!name) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO string_fields (name) 
       VALUES ($1)
       RETURNING id, name`,
      [name],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// post integer-fields
app.post("/api/integer-fields", verifyUser, (req, res) => {
  let { name } = req.body;
  if (!name) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO integer_fields (name) 
       VALUES ($1)
       RETURNING id, name`,
      [name],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// post checkbox-fields
app.post("/api/checkbox-fields", verifyUser, (req, res) => {
  let { name } = req.body;
  if (!name) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO checkbox_fields (name) 
       VALUES ($1)
       RETURNING id, name`,
      [name],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// delete string-fields
app.delete("/api/string-fields/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  pool.query(
    `DELETE
     FROM string_fields
     WHERE id = $1
     RETURNING id, name;
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

// delete integer-fields
app.delete("/api/integer-fields/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  pool.query(
    `DELETE
     FROM integer_fields
     WHERE id = $1
     RETURNING id, name;
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

// delete checkbox-fields
app.delete("/api/checkbox-fields/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  pool.query(
    `DELETE
     FROM checkbox_fields
     WHERE id = $1
     RETURNING id, name;
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

// update string-field
app.put("/api/string-fields/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  let { name, collectionId } = req.body;
  if (!name || !collectionId) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `UPDATE string_fields
         SET name = $1, collection_id = $2
         WHERE id = $3
         RETURNING id, name, collection_id;`,
      [name, collectionId, id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.rows.length > 0) {
          res.status(201).send(result.rows[0]);
        } else {
          res.status(404).send("Not found");
        }
      }
    );
  }
});

// update integer-field
app.put("/api/integer-fields/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  let { name, collectionId } = req.body;
  if (!name || !collectionId) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `UPDATE integer_fields
         SET name = $1, collection_id = $2
         WHERE id = $3
         RETURNING id, name, collection_id;`,
      [name, collectionId, id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.rows.length > 0) {
          res.status(201).send(result.rows[0]);
        } else {
          res.status(404).send("Not found");
        }
      }
    );
  }
});

// update checkbox-field
app.put("/api/checkbox-fields/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  let { name, collectionId } = req.body;
  if (!name || !collectionId) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `UPDATE checkbox_fields
         SET name = $1, collection_id = $2
         WHERE id = $3
         RETURNING id, name, collection_id;`,
      [name, collectionId, id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.rows.length > 0) {
          res.status(201).send(result.rows[0]);
        } else {
          res.status(404).send("Not found");
        }
      }
    );
  }
});

// get string-fields by collection_id
app.get("/api/string-fields", verifyUser, (req, res) => {
  let collectionId = req.query.collectionId;
  pool.query(
    `SELECT * FROM string_fields WHERE collection_id = $1`,
    [collectionId],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

// get integer-fields by collection_id
app.get("/api/integer-fields", verifyUser, (req, res) => {
  let collectionId = req.query.collectionId;
  pool.query(
    `SELECT * FROM integer_fields WHERE collection_id = $1`,
    [collectionId],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

// get checkbox-fields by collection_id
app.get("/api/checkbox-fields", verifyUser, (req, res) => {
  let collectionId = req.query.collectionId;
  pool.query(
    `SELECT * FROM checkbox_fields WHERE collection_id = $1`,
    [collectionId],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

// get items by collectionId
app.get("/api/items", (req, res) => {
  let collectionId = req.query.collectionId;
  pool.query(
    `SELECT items.id, items.name, items.created_at, items.image_id, items.tags, uploads.image_url FROM items JOIN uploads ON items.image_id = uploads.id WHERE items.collection_id =$1`,
    [collectionId],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

// get All Items
app.get("/api/all-items", (req, res) => {
  pool.query(
    `SELECT items.id,
     items.name AS title, 
     items.image_id, 
     uploads.image_url,
      users.name AS author 
      FROM items JOIN uploads ON items.image_id = uploads.id 
      JOIN collections ON items.collection_id = collections.id 
      JOIN users ON collections.user_id = users.id`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result.rows);
    }
  );
});

app.get("/api/single-item", (req, res) => {
  let itemId = req.query.itemId;
  pool.query(
    `SELECT items.id, 
    items.name AS title, 
    items.image_id, 
    uploads.image_url, 
    users.name AS author,
    items.tags,
    collections.name AS collection_name,
    items.created_at,
    categories.name AS topic
    FROM items 
    JOIN uploads ON items.image_id = uploads.id 
    JOIN collections ON items.collection_id = collections.id 
    JOIN users ON collections.user_id = users.id
    JOIN categories ON collections.category_id = categories.id 
    WHERE items.id = $1`,
    [itemId],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result.rows[0]);
    }
  );
});

// post item
app.post("/api/items", verifyUser, (req, res) => {
  let { name, imageId, collection_id, tags } = req.body;
  if ((!name || !imageId, !collection_id || !tags)) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO items (name, image_id, collection_id, tags) 
       VALUES ($1, $2, $3, $4)
       RETURNING id, name`,
      [name, imageId, collection_id, tags],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// delete item
app.delete("/api/items/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  pool.query(
    `DELETE
     FROM items
     WHERE id = $1
     RETURNING id, name;
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

// update item
app.put("/api/items/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  let { name, image_id, tags } = req.body;
  if (!name || !image_id || !tags) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `UPDATE items
         SET name = $1, image_id = $2, tags = $3
         WHERE id = $4
         RETURNING id, name;`,
      [name, image_id, tags, id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.rows.length > 0) {
          res.status(202).send(result.rows[0]);
        } else {
          res.status(404).send("Not found");
        }
      }
    );
  }
});

// get tags
app.get("/api/tags", (req, res) => {
  pool.query(`SELECT * FROM tags`, (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(result.rows);
    res.send(result.rows);
  });
});

// get tags using arr
app.get("/api/tags/:id", (req, res) => {
  let tag_id = req.params.id;
  pool.query(`SELECT * FROM tags WHERE id = $1`, [tag_id], (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(result.rows);
    res.send(result.rows[0]);
  });
});

// post tags
app.post("/api/tags", (req, res) => {
  let { name } = req.body;
  if (!name) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO tags (tagname) 
       VALUES ($1)
       RETURNING id, tagname`,
      [name],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// post string-values
app.post("/api/string-values", (req, res) => {
  let { value, string_id, item_id } = req.body;
  if (!value || !string_id || !item_id) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO string_values (value, item_id, string_id) 
       VALUES ($1, $2, $3)
       RETURNING id, value, item_id, string_id`,
      [value, item_id, string_id],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// post integer-values
app.post("/api/integer-values", (req, res) => {
  let { value, integer_id, item_id } = req.body;
  if (!value || !integer_id || !item_id) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO integer_values (value, item_id, integer_id) 
       VALUES ($1, $2, $3)
       RETURNING id, value, item_id, integer_id`,
      [value, item_id, integer_id],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// post checkbox-values
app.post("/api/checkbox-values", (req, res) => {
  let { value, checkbox_id, item_id } = req.body;
  if (!checkbox_id || !item_id) {
    res.status(400).send("Error");
  } else {
    pool.query(
      `INSERT INTO checkbox_values (value, item_id, checkbox_id) 
       VALUES ($1, $2, $3)
       RETURNING id, value, item_id, checkbox_id`,
      [value, item_id, checkbox_id],
      (err, r) => {
        if (err) {
          console.log(err);
        }
        if (r.rows.length > 0) {
          res.status(200).send(r.rows[0]);
        }
      }
    );
  }
});

// get string-values
app.get("/api/string-values", (req, res) => {
  const item_id = req.query.item_id;
  pool.query(
    `SELECT * FROM string_values WHERE item_id = $1`,
    [item_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

// get integer-values
app.get("/api/integer-values", (req, res) => {
  const item_id = req.query.item_id;
  pool.query(
    `SELECT * FROM integer_values WHERE item_id = $1`,
    [item_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

// get checkbox-values
app.get("/api/checkbox-values", (req, res) => {
  const item_id = req.query.item_id;
  pool.query(
    `SELECT * FROM checkbox_values WHERE item_id = $1`,
    [item_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

app.get("/api/item-string-fields", (req, res) => {
  const item_id = req.query.itemId;
  pool.query(
    `SELECT string_values.id,
     string_values.value,
      string_fields.name 
       FROM string_values 
       JOIN string_fields ON string_fields.id = string_values.string_id 
       WHERE string_values.item_id = $1`,
    [item_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

app.get("/api/item-integer-fields", (req, res) => {
  const item_id = req.query.itemId;
  pool.query(
    `SELECT integer_values.id,
     integer_values.value,
      integer_fields.name 
       FROM integer_values 
       JOIN integer_fields ON integer_fields.id = integer_values.integer_id 
       WHERE integer_values.item_id = $1`,
    [item_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

app.get("/api/item-checkbox-fields", (req, res) => {
  const item_id = req.query.itemId;
  pool.query(
    `SELECT checkbox_values.id,
    checkbox_values.value,
    checkbox_fields.name 
       FROM checkbox_values 
       JOIN checkbox_fields ON checkbox_fields.id = checkbox_values.checkbox_id 
       WHERE checkbox_values.item_id = $1`,
    [item_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(result.rows);
      res.send(result.rows);
    }
  );
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
