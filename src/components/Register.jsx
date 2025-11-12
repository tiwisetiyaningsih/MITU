import { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './style.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import ilustrasi from "../assets/ilustrasi.svg";

function Register() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    username: "",
    NIM: "",
    NIP: "",
    password: "",
    role: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Update role otomatis saat email berubah
  useEffect(() => {
    if (form.email.includes("@student.telkomuniversity.ac.id")) {
      setForm(f => ({ ...f, role: "Mahasiswa", NIP: "" }));
    } else if (form.email.includes("@telkomuniversity.ac.id")) {
      setForm(f => ({ ...f, role: "Dosen", NIM: "" }));
    } else {
      setForm(f => ({ ...f, role: "", NIM: "", NIP: "" }));
    }
  }, [form.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log("Data dikirim ke server:", form);
    try {
      const response = await axios.post("http://localhost:5000/register", form, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Response server:", response.data);
      setMessage("✅ Registrasi berhasil!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      if (err.response) {
        setMessage(`❌ ${err.response.data.message || 'Gagal registrasi!'}`);
      } else {
        setMessage("❌ Gagal registrasi!");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src="/logo_mitu.svg" alt="MITU Logo" className="mitu-logo" />
      </div>

      <div className="login-right">
        <h2>Register</h2>
        <img src={ilustrasi} alt="Register Illustration" className="login-illustration" />

        <form onSubmit={handleSubmit}>
          <input
            name="nama"
            placeholder="Nama Lengkap"
            value={form.nama}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          {/* Tampilkan input NIM/NIP sesuai role */}
          {form.role === "Mahasiswa" && (
            <input
              name="NIM"
              placeholder="NIM"
              value={form.NIM}
              onChange={handleChange}
              required
            />
          )}
          {form.role === "Dosen" && (
            <input
              name="NIP"
              placeholder="NIP"
              value={form.NIP}
              onChange={handleChange}
              required
            />
          )}

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <svg
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              {showPassword ? (
                <>
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7a11.05 11.05 0 0 1 5.23-5.6" />
                  <path d="M1 1l22 22" />
                  <path d="M9.53 9.53A3.5 3.5 0 0 0 14.47 14.47" />
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </div>

          <button type="submit">Daftar</button>
        </form>

          <p className={`login-message ${message.includes("✅") ? "success" : message.includes("❌") ? "error" : ""}`}>
          {message}
        </p>
        <p className="register-link">
          Sudah punya akun? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
