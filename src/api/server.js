import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db.js";
import multer from "multer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2";

// Untuk __dirname di ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ================== MULTER SETUP ==================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage });

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

  const checkSql = "SELECT * FROM users WHERE Email = ? OR Username = ? OR NIM = ? OR NIP = ?" ;
  db.query(checkSql, [email, username, NIM, NIP], (err, results) => {
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
      const user = results[0];

      // 🔥 Cek apakah akun Nonaktif
      if (user.StatusAkun === "Nonaktif") {
        return res.json({
          success: false,
          message: "❌ Maaf, akun Anda Nonaktif!",
        });
      }

      // Jika akun aktif → lanjut login
      return res.json({
        success: true,
        message: "✅ Login berhasil!",
        user: user,
      });
    } else {
      return res.json({
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

// ========== GET KEGIATAN (SEARCH) =========
app.get("/kegiatan/search/:keyword", (req, res) => {
  const { keyword } = req.params;
  const sql = "SELECT * FROM kegiatan WHERE NamaKegiatan LIKE ?";
  db.query(sql, [`%${keyword}%`], (err, results) => {
    if (err) {
      console.error("❌ Error cari kegiatan:", err);
      return res.status(500).json({ success: false, message: "Gagal mencari kegiatan" });
    }
    res.json(results);
  });
});

// ========== POST KEGIATAN (TAMBAH) ==========
app.post("/kegiatan", upload.single("ImageKegiatan"), (req, res) => {
    console.log("📨 Data diterima:", req.body);

    const {
        UserID,
        NamaKegiatan,
        DeskripsiKegiatan,
        StatusKegiatan,
        TglMulaiKegiatan,
        TglAkhirKegiatan,
        TempatKegiatan,
        PenyelenggaraKegiatan,
        KategoriKegiatan,
        TingkatKegiatan,
        LinkPendaftaran
    } = req.body;

    if (!NamaKegiatan || !TglMulaiKegiatan || !StatusKegiatan) {
        return res.status(400).json({ success: false, message: "Nama, Tanggal Mulai, dan Status wajib diisi!" });
    }

    const user_id = UserID || 1;

    const ImageKegiatan = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO kegiatan (
            UserID, NamaKegiatan, DeskripsiKegiatan, StatusKegiatan,
            TglMulaiKegiatan, TglAkhirKegiatan, TempatKegiatan, 
            PenyelenggaraKegiatan, KategoriKegiatan, TingkatKegiatan,
            ImageKegiatan, LinkPendaftaran
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        user_id, NamaKegiatan, DeskripsiKegiatan, StatusKegiatan,
        TglMulaiKegiatan, TglAkhirKegiatan || null, TempatKegiatan,
        PenyelenggaraKegiatan, KategoriKegiatan, TingkatKegiatan,
        ImageKegiatan, LinkPendaftaran
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({
                success: false,
                message: "Gagal menambahkan kegiatan",
                error: err
            });
        }
        res.json({
            success: true,
            message: "✅ Kegiatan berhasil ditambahkan",
            KegiatanID: result.insertId
        });
    });
});



// ========== UPDATE KEGIATAN ==========
app.put("/kegiatan/:id", upload.single("ImageKegiatan"), (req, res) => {
    const { id } = req.params;

    const {
        NamaKegiatan, DeskripsiKegiatan, StatusKegiatan,
        TglMulaiKegiatan, TglAkhirKegiatan, TempatKegiatan,
        PenyelenggaraKegiatan, KategoriKegiatan, TingkatKegiatan,
        LinkPendaftaran
    } = req.body;

    const newImage = req.file ? req.file.filename : null;

    // Ambil gambar lama
    const sqlGet = "SELECT ImageKegiatan FROM kegiatan WHERE KegiatanID = ?";
    db.query(sqlGet, [id], (err, oldData) => {
        if (err || oldData.length === 0) {
            return res.status(500).json({ success: false, message: "Kegiatan tidak ditemukan" });
        }

        const oldImage = oldData[0].ImageKegiatan;
        const finalImage = newImage || oldImage;

        // Jika user upload gambar baru → hapus gambar lama
        if (newImage && oldImage) {
            fs.unlink(path.join(__dirname, "uploads", oldImage), (err) => {
                if (err) console.warn("⚠️ Gagal hapus gambar lama:", err);
            });
        }

        const sql = `
            UPDATE kegiatan SET
                NamaKegiatan=?, DeskripsiKegiatan=?, StatusKegiatan=?,
                TglMulaiKegiatan=?, TglAkhirKegiatan=?, TempatKegiatan=?,
                PenyelenggaraKegiatan=?, KategoriKegiatan=?, TingkatKegiatan=?,
                ImageKegiatan=?, LinkPendaftaran=?
            WHERE KegiatanID=?
        `;

        const values = [
            NamaKegiatan, DeskripsiKegiatan, StatusKegiatan,
            TglMulaiKegiatan, TglAkhirKegiatan || null, TempatKegiatan,
            PenyelenggaraKegiatan, KategoriKegiatan, TingkatKegiatan,
            finalImage, LinkPendaftaran, id
        ];

        db.query(sql, values, (err2) => {
            if (err2) {
                console.error("❌ Error update kegiatan:", err2);
                return res.status(500).json({ success: false, message: "Gagal update kegiatan" });
            }
            res.json({ success: true, message: "✅ Kegiatan berhasil diupdate!" });
        });
    });
});


// ========== DELETE KEGIATAN ==========
// HAPUS KEGIATAN
app.delete("/kegiatan/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM kegiatan WHERE KegiatanID = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ Error DELETE:", err);
            return res.status(500).json({ success: false, message: "Gagal menghapus kegiatan" });
        }

        return res.json({ success: true, message: "Kegiatan berhasil dihapus" });
    });
});




// ================== GET DETAIL KEGIATAN ==================
app.get("/detail-kegiatan/:KegiatanID", (req, res) => {
  const { KegiatanID } = req.params;

  const sql = `
    SELECT * FROM kegiatan 
    WHERE KegiatanID = ?
  `;

  db.query(sql, [KegiatanID], (err, result) => {
    if (err) {
      console.error("❌ Error ambil detail kegiatan:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil detail kegiatan" 
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kegiatan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: result[0]
    });
  });
});


// ================= KEGIATAN TERSIMPAN =================

// ========== GET KEGIATAN TERSIMPAN BY USER ID ==========
app.get("/kegiatan-tersimpan/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT k.* FROM kegiatan k
    INNER JOIN kegiatantersimpan ks ON k.KegiatanID = ks.KegiatanID
    WHERE ks.UserID = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error ambil kegiatan tersimpan:", err);
      return res.status(500).json({ success: false, message: "Gagal mengambil kegiatan tersimpan" });
    }
    res.json(results);
  });
});


// ========== SIMPAN KEGIATAN ==========
app.post("/simpan-kegiatan", (req, res) => {
  const { UserID, KegiatanID } = req.body;

  if (!UserID || !KegiatanID) {
    return res.status(400).json({ success: false, message: "UserID atau KegiatanID tidak ditemukan" });
  }

  // Cek apakah sudah tersimpan
  const checkSql = "SELECT * FROM kegiatantersimpan WHERE UserID = ? AND KegiatanID = ?";
  db.query(checkSql, [UserID, KegiatanID], (err, rows) => {
    if (err) {
      console.error("❌ Error check:", err);
      return res.status(500).json({ success: false, message: "Gagal melakukan pengecekan" });
    }

    if (rows.length > 0) {
      return res.json({ success: true, already: true, message: "📌 Kegiatan sudah pernah disimpan" });
    }

    // Insert jika belum ada
    const sql = "INSERT INTO kegiatantersimpan (UserID, KegiatanID) VALUES (?, ?)";
    db.query(sql, [UserID, KegiatanID], (err, result) => {
      if (err) {
        console.error("❌ Error simpan kegiatan:", err);
        return res.status(500).json({ success: false, message: "Gagal menyimpan kegiatan" });
      }
      res.json({ success: true, message: "✅ Kegiatan berhasil disimpan!" });
    });
  });
});


// ========== HAPUS SIMPAN KEGIATAN ==========
app.delete("/hapus-simpan-kegiatan", (req, res) => {
  const { UserID, KegiatanID } = req.body;
  const sql = "DELETE FROM kegiatantersimpan WHERE UserID = ? AND KegiatanID = ?";
  db.query(sql, [UserID, KegiatanID], (err, result) => {
    if (err) {
      console.error("❌ Error hapus simpan kegiatan:", err);
      return res.status(500).json({ success: false, message: "Gagal menghapus simpanan kegiatan" });
    }
    res.json({ success: true, message: "✅ Simpanan kegiatan berhasil dihapus!" });
  });
});

// ================= USERS (CRUD) =================

// ========== GET ALL USERS ==========
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error ambil data users:", err);
      return res.status(500).json({ success: false, message: "Gagal mengambil data users" });
    }
    res.json(results);
  });
});

// ========== UPDATE USER ==========
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { Nama, Email, Username, Role, NIM, NIP, StatusAkun } = req.body;
  const sql = `
    UPDATE users
    SET
      Nama = ?,
      Email = ?,
      Username = ?,
      Role = ?,
      NIM = ?,
      NIP = ?,
      StatusAkun = ?
    WHERE UserID = ?
  `;
  const values = [Nama, Email, Username, Role, NIM, NIP, StatusAkun, id];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error update user:", err);
      return res.status(500).json({ success: false, message: "Gagal mengupdate user" });
    }
    res.json({ success: true, message: "✅ User berhasil diupdate!" });
  });
});



// ========== START SERVER ==========

app.get("/", (req, res) => {
  res.send("✅ Server MITU aktif & siap digunakan!");
});

app.listen(5000, () => {
  console.log("🚀 Server berjalan di http://localhost:5000");
});
