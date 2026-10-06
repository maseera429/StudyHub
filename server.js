const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "studyhub",
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 30000
});
db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }

  console.log("MySQL connected successfully ✅");
});

app.get("/", (req, res) => {
  res.json({
    message: "StudyHub Backend API is running 🚀"
  });
});

app.get("/api/materials", (req, res) => {
  const sql = "SELECT * FROM materials ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(results);
  });
});

app.post("/api/materials", (req, res) => {
  const { title, subject, description, file_url } = req.body;

  const sql = `
    INSERT INTO materials (title, subject, description, file_url)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, subject, description, file_url],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Material added successfully",
        id: result.insertId
      });
    }
  );
});

app.delete("/api/materials/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM materials WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json({
      message: "Material deleted successfully"
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`StudyHub Backend running on port ${PORT}`);
});
