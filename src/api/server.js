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

// ========== POST KEGIATAN (TAMBAH) =========
app.post("/kegiatan", (req, res) => {
  const {
    UserID,
    NamaKegiatan,
    DeskripsiKegiatan,
    StatusKegiatan,
    TglMulaiKegiatan, // Akan dikirim sebagai string YYYY-MM-DD
    TglAkhirKegiatan, // Akan dikirim sebagai string YYYY-MM-DD
    TempatKegiatan,
    PenyelenggaraKegiatan,
    KategoriKegiatan,
    TingkatKegiatan,
    ImageKegiatan,
    LinkPendaftaran,
  } = req.body;
  
  // Default UserID (sesuaikan dengan logika login Anda)
  const user_id = UserID || 1; // Contoh default jika tidak ada UserID

  const sql = `
    INSERT INTO kegiatan (
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
      ImageKegiatan,
      LinkPendaftaran
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    user_id,
    NamaKegiatan,
    DeskripsiKegiatan,
    StatusKegiatan,
    TglMulaiKegiatan,
    TglAkhirKegiatan,
    TempatKegiatan,
    PenyelenggaraKegiatan,
    KategoriKegiatan,
    TingkatKegiatan,
    ImageKegiatan,
    LinkPendaftaran,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error tambah kegiatan:", err);
      return res.status(500).json({ success: false, message: "Gagal menambahkan kegiatan" });
    }
    res.json({ success: true, message: "✅ Kegiatan berhasil ditambahkan!", id: result.insertId });
  });
});

// ========== UPDATE KEGIATAN ==========
app.put("/kegiatan/:id", (req, res) => {
  const { id } = req.params;
  const {
    NamaKegiatan,
    DeskripsiKegiatan,
    StatusKegiatan,
    TglMulaiKegiatan,
    TglAkhirKegiatan,
    TempatKegiatan,
    PenyelenggaraKegiatan,
    KategoriKegiatan,
    TingkatKegiatan,
    ImageKegiatan,
    LinkPendaftaran,
  } = req.body;
  const sql = `
    UPDATE kegiatan
    SET
      NamaKegiatan = ?,
      DeskripsiKegiatan = ?,
      StatusKegiatan = ?,
      TglMulaiKegiatan = ?,
      TglAkhirKegiatan = ?,
      TempatKegiatan = ?,
      PenyelenggaraKegiatan = ?,
      KategoriKegiatan = ?,
      TingkatKegiatan = ?,
      ImageKegiatan = ?,
      LinkPendaftaran = ?
    WHERE KegiatanID = ?
  `;
  const values = [
    NamaKegiatan,
    DeskripsiKegiatan,
    StatusKegiatan,
    TglMulaiKegiatan,
    TglAkhirKegiatan,
    TempatKegiatan,
    PenyelenggaraKegiatan,
    KategoriKegiatan,
    TingkatKegiatan,
    ImageKegiatan,
    LinkPendaftaran,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error update kegiatan:", err);
      return res.status(500).json({ success: false, message: "Gagal mengupdate kegiatan" });
    }
    res.json({ success: true, message: "✅ Kegiatan berhasil diupdate!" });
  });
});

// ========== DELETE KEGIATAN ==========
app.delete("/kegiatan/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM kegiatan WHERE KegiatanID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error hapus kegiatan:", err);
      return res.status(500).json({ success: false, message: "Gagal menghapus kegiatan" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Kegiatan tidak ditemukan" });
    }
    res.json({ success: true, message: "✅ Kegiatan berhasil dihapus!" });
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

// ========== DELETE USER ==========
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE UserID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error hapus user:", err);
      return res.status(500).json({ success: false, message: "Gagal menghapus user" });
    }
    res.json({ success: true, message: "✅ User berhasil dihapus!" });
  });
});

// ========== START SERVER ==========

app.get("/", (req, res) => {
  res.send("✅ Server MITU aktif & siap digunakan!");
});

app.listen(5000, () => {
  console.log("🚀 Server berjalan di http://localhost:5000");
});
