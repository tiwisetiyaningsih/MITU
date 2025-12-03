import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ilustrasi from "../assets/ilustrasi.svg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      // Jika login gagal normal (username / pass salah)
      if (!res.data.success) {
        setMessage(res.data.message);
        return;
      }

      // 🔒 CEK STATUS AKUN
      if (res.data.user.StatusAkun === "Nonaktif") {
        setMessage("❌ Akun anda dinonaktifkan!");
        return;
      }

      // Jika login berhasil dan akun aktif
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("✅ Login berhasil! Selamat datang, " + res.data.user.Nama + "!");

      if (res.data.user.Role === "Admin") {
        navigate("/dashboardAdmin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
      setMessage("⚠️ Gagal konek ke server!");
    }
  };

  return (
    <div className="login-page">
      {/* Bagian kiri */}
      <div className="login-left">
        <img src="/logo_mitu.svg" alt="MITU Logo" className="mitu-logo" />
      </div>

      {/* Bagian kanan */}
      <div className="login-right">
        <h2>Login</h2>
        <img src={ilustrasi} alt="Login Illustration" className="login-illustration" />

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Input password dengan ikon di dalam field */}
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <svg
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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

          <button type="submit">Login</button>
        </form>

        <p className="login-message">{message}</p>
        <p className="register-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
