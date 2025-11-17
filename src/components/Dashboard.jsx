import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Pastikan axios di-import

// Import Bootstrap & Bootstrap Icons
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Import CSS kustom kita (Pastikan file ini ada)
import "./dashboard.css";

function Dashboard() {
  const [kegiatan, setKegiatan] = useState([]); // State kosong, diisi oleh API
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  const mockOngoing = [
    {
      KegiatanID: 101,
      NamaKegiatan: "Google Workshop: Prompt...",
      KategoriKegiatan: "WORKSHOP",
      TglMulaiKegiatan: "2025-11-10T00:00:00.000Z",
      Lokasi: "TULT L.1.16",
      ImageKegiatan: "workshop_google.png",
      LinkPendaftaran: "#",
      Tambahan: "Terbuka untuk umum",
    },
    {
      KegiatanID: 102,
      NamaKegiatan: "Bank Indonesia Goes to Cam...",
      KategoriKegiatan: "Event",
      TglMulaiKegiatan: "2025-11-10T00:00:00.000Z",
      Lokasi: "Gedung Mentarawu",
      ImageKegiatan: "bank_indonesia.png",
      LinkPendaftaran: "#",
      Tambahan: "Get to know Batik Indonesia",
    },
  ];

  // Data Mock untuk Rekomendasi Kegiatan (Sesuai Gambar)
  // GANTI INI: Gunakan data asli dari state 'kegiatan' jika API Anda sudah siap
  const mockRekomendasi = [
    {
      KegiatanID: 201,
      NamaKegiatan: "Open Recruitment Staff Muda HIMA IF",
      KategoriKegiatan: "Organisasi",
      TanggalMulai: "2025-11-18T00:00:00.000Z",
      Lokasi: "Online",
      ImageKegiatan: "oprec_staff_muda.png",
      Label: "TODAY IS THE BIG DAY",
      LinkPendaftaran: "#",
    },
    {
      KegiatanID: 202,
      NamaKegiatan: "Seminar Aplikasi Gojek",
      KategoriKegiatan: "Event",
      TanggalMulai: "2025-11-18T00:00:00.000Z",
      Lokasi: "Gedung Damar",
      ImageKegiatan: "seminar_gojek.png",
      Label: "#MakinMemahamiGojek",
      LinkPendaftaran: "#",
    },
    {
      KegiatanID: 203,
      NamaKegiatan: "Open Recruitment Staff Muda HIMA IF",
      KategoriKegiatan: "Organisasi",
      TanggalMulai: "2025-11-10T00:00:00.000Z",
      Lokasi: "Online",
      ImageKegiatan: "oprec_staff_muda.png",
      Label: "TODAY IS THE BIG DAY",
      LinkPendaftaran: "#",
    },
    // Tambahkan data mock lainnya jika diperlukan
  ];

  // Cek user login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Data user mock jika tidak ada (sesuai gambar)
      setUser({
        Nama: "Gisela Senaria Kusthika Putri",
        NIM: "103912300331", // Menambahkan NIM untuk kelengkapan
      });
    }
  }, []);

  // Ambil data kegiatan dari API
  useEffect(() => {
    setKegiatan([...mockOngoing, ...mockRekomendasi]);
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

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  // --- LOGIKA PEMISAHAN DATA ---
  const ongoingKegiatan = mockOngoing; 

  // 2. Data untuk "Rekomendasi Kegiatan" (Difilter)
  const filteredData = mockRekomendasi.filter(
    (item) =>
      (filter === "Semua" || item.KategoriKegiatan === filter) &&
      item.NamaKegiatan.toLowerCase().includes(search.toLowerCase())
  );

  // Fungsi Logout
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };


  // RENDER COMPONENT

  return (
    <div className="dashboard-container">
      {/* ======================= */}
      {/* SIDEBAR (Kiri) */}
      {/* ======================= */}
      <aside className="sidebar-custom">
        <div className="sidebar-header-custom">
          <img src="/mitu_bw.svg" alt="MITU Logo" style={{maxWidth:'107px', maxHeight:'61px'}}/>
        </div>

        {/* User Info di Atas Menu (Sesuai Gambar) */}
        <div className="sidebar-user-info">
          <div className="user-avatar-initial-large">
            {user ? user.Nama.charAt(0) : "G"}
          </div>
          <div className="user-detail-custom">
            <div className="user-name-custom">
              {user ? user.Nama : "Nama User"}
            </div>
            {/* Menggunakan NIM karena terlihat seperti NIM di gambar */}
            <div className="user-nim-custom">{user ? user.NIM : "Memuat..."}</div>
          </div>
        </div>
        <hr className="menu-separator" />
        <div className="menu-label" style={{fontSize:'14px'}}>Menu</div>

        <nav className="sidebar-nav-custom">
          <a href="#beranda" className="nav-link-custom active">
            <i className="bi bi-house-door-fill"></i>
            <span>Beranda</span>
          </a>
          <a href="/myprofile" className="nav-link-custom">
            <i className="bi bi-person-fill"></i>
            <span>Profil</span>
          </a>
        </nav>

        <div className="sidebar-footer-custom" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Keluar</span>
        </div>
      </aside>

      {/* ======================= */}
      {/* MAIN CONTENT (Kanan) */}
      {/* ======================= */}
      <main className="main-content-custom">
        {/* Header (Search bar) - Sesuai Gambar, Search Bar Pindah ke Atas Content */}
        <header className="main-header-custom">
          <div className="search-bar-custom">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="form-control-custom"
              placeholder="Cari kegiatan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Judul Halaman */}
        <h1 className="main-title-custom">Beranda</h1>

        {/* Section: Kegiatan Tengah Berlangsung */}
        <section className="section-berlangsung mb-5">
          <h2 className="section-title-custom">Kegiatan tengah berlangsung</h2>
          <div className="row g-3" style={{paddingLeft:'50px'}}>
            {ongoingKegiatan.length > 0 ? (
              ongoingKegiatan.map((item) => (
                <div key={item.KegiatanID} className="col-12 col-lg-6">
                  {/* Card untuk Kegiatan Berlangsung */}
                  <div className="card ongoing-card-custom">
                    <div className="ongoing-card-left">
                      <img
                        src={`/images/${item.ImageKegiatan}`}
                        alt={item.NamaKegiatan}
                        className="ongoing-img"
                      />
                    </div>
                    <div className="ongoing-card-body">
                      <h5 className="ongoing-card-title">
                        {item.NamaKegiatan}
                      </h5>
                      <div className="info-rekomendasi category-info">
                            <span className="badge category-badge-rekomendasi">{item.KategoriKegiatan}</span>
                        </div>
                      <div className="ongoing-card-info">
                        <div className="info-item">
                          <i className="bi bi-calendar-event"></i>
                          <div className="date-info">
                            <span>{formatDate(item.TglMulaiKegiatan)}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <i className="bi bi-geo-alt-fill"></i>
                          <div className="location-info">
                            <span>{item.Lokasi}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted ms-3">
                Tidak ada kegiatan yang berlangsung hari ini.
              </p>
            )}
          </div>
        </section>
        
        <hr className="section-separator" />

        {/* Section: Rekomendasi Kegiatan */}
        <section className="section-rekomendasi">
          {/* Filter Buttons */}
          <div className="filter-buttons-custom mb-3" style={{paddingLeft:'50px'}}>
            {kategoriList.map((cat) => (
              <button
                key={cat}
                className={`btn btn-filter-custom ${
                  filter === cat ? "active" : ""
                }`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <h2 className="section-title-custom">Rekomendasi kegiatan</h2>

          {/* Card Grid */}
          <div className="row g-4 mb-3" style={{paddingLeft:'50px'}}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item.KegiatanID} className="col-lg-4 col-md-6">
                  {/* Card Rekomendasi */}
                  <div className="card rekomendasi-card-custom">
                    <div className="card-header-rekomendasi">
                        <img
                            src={`/images/${item.ImageKegiatan}`}
                            alt={item.NamaKegiatan}
                            className="card-img-rekomendasi"
                        />
                    </div>
                    <div className="card-body-rekomendasi">
                        <h5 className="card-title-rekomendasi">{item.NamaKegiatan}</h5>
                        <div className="info-rekomendasi">
                            <i className="bi bi-calendar-event"></i>
                            <span>{formatDate(item.TanggalMulai)}</span>
                        </div>
                        <div className="info-rekomendasi">
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>{item.Lokasi}</span>
                        </div>
                        <div className="info-rekomendasi category-info">
                            <span className="badge category-badge-rekomendasi">{item.KategoriKegiatan}</span>
                        </div>
                    </div>
                    <div className="card-footer-rekomendasi">
                      <a
                        href={item.LinkPendaftaran}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-lihat-custom"
                      >
                        Lihat
                      </a>
                      <i className="bi bi-bookmark bookmark-icon"></i>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted ms-3">
                Tidak ada kegiatan ditemukan untuk filter saat ini.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;