import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",         
  password: "",         
  database: "mitu"      
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal:", err);
  } else {
    console.log("✅ Terhubung ke database mitu");
  }
});

export default db;
