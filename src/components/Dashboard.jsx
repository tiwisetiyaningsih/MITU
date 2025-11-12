import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Pastikan axios di-import

// Import Bootstrap & Bootstrap Icons
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Import CSS kustom kita
import "./dashboard.css";

function Dashboard() {
  const [kegiatan, setKegiatan] = useState([]); // State kosong, diisi oleh API
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // State untuk dropdown logout
  const navigate = useNavigate();

  // Cek user login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Data user mock jika tidak ada (sesuai gambar)
      // Anda bisa menggantinya dengan navigate("/login") jika user wajib login
      setUser({
        Nama: "Giselia Senara K",
        Email: "giselia@student.telkomuniversity.ac.id",
      });
    }
  }, [navigate]);

  // Ambil data kegiatan dari API
  useEffect(() => {
    axios
      .get("http://localhost:5000/kegiatan") // Pastikan URL API Anda benar
      .then((res) => {
        console.log("Data dari API:", res.data); // Cek data di console browser
        setKegiatan(res.data);
      })
      .catch((err) => console.error("Error fetch:", err));
  }, []);

  // Kategori List (SESUAI GAMBAR)
  const kategoriList = [
    "Semua",
    "Event",
    "Seminar",
    "Webinar",
    "Organisasi",
    "UKM",
  ];

  // Fungsi untuk format tanggal (Opsional, tapi dianjurkan)
  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // --- LOGIKA PEMISAHAN DATA ---

  // 1. Data untuk "Kegiatan Tengah Berlangsung"
  const today = new Date().toISOString().split("T")[0];
  const ongoingKegiatan = kegiatan.filter(
    (item) =>
      // GANTI INI: 'TanggalMulai' mungkin berbeda di API Anda
      item.TanggalMulai && item.TanggalMulai.split("T")[0] === today
  );

  // 2. Data untuk "Rekomendasi Kegiatan" (Difilter)
  const filteredData = kegiatan.filter(
    (item) =>
      // GANTI INI: 'KategoriKegiatan' & 'NamaKegiatan' mungkin berbeda
      (filter === "Semua" || item.KategoriKegiatan === filter) &&
      item.NamaKegiatan.toLowerCase().includes(search.toLowerCase())
  );

  // Fungsi Logout dengan Konfirmasi
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* ======================= */}
      {/* SIDEBAR (Kiri) */}
      {/* ======================= */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/mitu_bw.svg" alt="MITU Logo" className="logo" />{" "}
          {/* Ganti path logo */}
        </div>
        <nav className="sidebar-nav">
          <a href="#beranda" className="nav-link active">
            <i className="bi bi-house-door-fill"></i>
            <span>Beranda</span>
          </a>
          <a href="#profil" className="nav-link">
            <i className="bi bi-person-fill"></i>
            <span>Profil</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar-initial">
            {user ? user.Nama.charAt(0) : "G"}
          </div>
          <div className="user-info">
            {user ? (
              <>
                <span className="user-name">{user.Nama}</span>
                <span className="user-email">{user.Email}</span>
              </>
            ) : (
              <span>Memuat...</span>
            )}
          </div>
        </div>
      </aside>

      {/* ======================= */}
      {/* MAIN CONTENT (Kanan) */}
      {/* ======================= */}
      <main className="main-content">
        {/* Header (Search bar & Avatar dengan Dropdown) */}
        <header className="main-header">
          <div className="search-bar">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Cari kegiatan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Menu Dropdown User */}
          <div className="user-menu">
            <div
              className="user-avatar-initial-header"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user ? user.Nama.charAt(0) : "G"}
            </div>

            {showDropdown && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-info">
                  <span className="user-name">{user?.Nama}</span>
                  <span className="user-email">{user?.Email}</span>
                </div>
                <hr />
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Judul Halaman */}
        <h1 className="main-title">Beranda</h1>

        {/* Section: Kegiatan Tengah Berlangsung */}
        <section className="mb-5">
          <h2 className="section-title">Kegiatan tengah berlangsung</h2>
          <div className="row g-4">
            {ongoingKegiatan.length > 0 ? (
              ongoingKegiatan.map((item) => (
                <div key={item.KegiatanID} className="col-lg-6">
                  <div className="card ongoing-card">
                    <img
                      // GANTI INI: 'ImageKegiatan' mungkin berbeda
                      src={`/images/${item.ImageKegiatan}`}
                      alt={item.NamaKegiatan}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      {/* GANTI INI: 'NamaKegiatan' mungkin berbeda */}
                      <h5 className="card-title">{item.NamaKegiatan}</h5>
                      {/* GANTI INI: 'KategoriKegiatan' mungkin berbeda */}
                      <span className="badge category-badge">
                        {item.KategoriKegiatan}
                      </span>
                      <div className="card-info">
                        <span>
                          <i className="bi bi-calendar-event"></i>{" "}
                          {/* GANTI INI: 'TanggalMulai' mungkin berbeda */}
                          {formatDate(item.TglMulaiKegiatan)}
                        </span>
                        <span>
                          <i className="bi bi-geo-alt-fill"></i>{" "}
                          {/* GANTI INI: 'Lokasi' adalah nama properti dari API Anda */}
                          {item.Lokasi || "Lokasi tidak tersedia"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">
                Tidak ada kegiatan yang berlangsung hari ini.
              </p>
            )}
          </div>
        </section>

        {/* Section: Rekomendasi Kegiatan */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="section-title mb-0">Rekomendasi kegiatan</h2>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons mb-4">
            {kategoriList.map((cat) => (
              <button
                key={cat}
                className={`btn btn-filter ${
                  filter === cat ? "active" : ""
                }`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Card Grid */}
          <div className="row g-4">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item.KegiatanID} className="col-lg-4 col-md-6">
                  <div className="card rekomendasi-card">
                    <img
                      // GANTI INI: 'ImageKegiatan' mungkin berbeda
                      src={`/images/${item.ImageKegiatan}`}
                      alt={item.NamaKegiatan}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      {/* GANTI INI: 'NamaKegiatan' mungkin berbeda */}
                      <h5 className="card-title">{item.NamaKegiatan}</h5>
                      <div className="card-info">
                        {/* GANTI INI: 'KategoriKegiatan' mungkin berbeda */}
                        <span className="badge category-badge-alt">
                          {item.KategoriKegiatan}
                        </span>
                        <span>
                          <i className="bi bi-calendar-event"></i>{" "}
                          {/* GANTI INI: 'TanggalMulai' mungkin berbeda */}
                          {formatDate(item.TanggalMulai)}
                        </span>
                        <span>
                          <i className="bi bi-geo-alt-fill"></i>{" "}
                          {/* GANTI INI: 'Lokasi' adalah nama properti dari API Anda */}
                          {item.Lokasi || "Lokasi tidak tersedia"}
                        </span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <a
                        // GANTI INI: 'LinkPendaftaran' mungkin berbeda
                        href={item.LinkPendaftaran}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-lihat"
                      >
                        Lihat
                      </a>
                      <i className="bi bi-bookmark"></i>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Tidak ada kegiatan ditemukan.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;