import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db.js";



const app = express();
app.use(cors());
app.use(bodyParser.json());

// ========== REGISTER ==========
app.post("/register", (req, res) => {
  const { nama, email, username, password, NIM, NIP } = req.body;

  let role = "";
  if (email.includes("@student.telkomuniversity.ac.id")) {
    role = "Mahasiswa";
  } else if (email.includes("@telkomuniversity.ac.id")) {
    role = "Dosen";
  } else {
    role = "Mahasiswa";
  }

  const checkSql = "SELECT * FROM users WHERE Email = ? OR Username = ?";
  db.query(checkSql, [email, username], (err, results) => {
    if (err) {
      console.error("❌ Error check user:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email atau username sudah terdaftar!" });
    }

    const sql = `
      INSERT INTO users (Nama, Email, Username, Password, Role, NIM, NIP, StatusAkun)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Aktif')
    `;
    db.query(sql, [nama, email, username, password, role, NIM || null, NIP || null], (err, result) => {
      if (err) {
        console.error("❌ Error register:", err);
        return res.status(500).json({ message: "Gagal registrasi!" });
      }

      res.json({
        success: true,
        message: "✅ Registrasi berhasil!",
        role,
      });
    });
  });
});

// ========== LOGIN ==========
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE Username = ? AND Password = ?";

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("❌ Error login:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length > 0) {
      res.json({
        success: true,
        message: "✅ Login berhasil!",
        user: results[0],
      });
    } else {
      res.json({
        success: false,
        message: "❌ Username atau password salah!",
      });
    }
  });
});


// ================= KEGIATAN (CRUD) =================

// ========== GET KEGIATAN ==========
app.get("/kegiatan", (req, res) => {
  const sql = "SELECT * FROM kegiatan ORDER BY KegiatanID DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error ambil data kegiatan:", err);
      return res.status(500).json({ success: false, message: "Gagal mengambil data kegiatan" });
    }
    res.json(results);
  });
});





// ========== START SERVER ==========

app.get("/", (req, res) => {
  res.send("✅ Server MITU aktif & siap digunakan!");
});

app.listen(5000, () => {
  console.log("🚀 Server berjalan di http://localhost:5000");
});
