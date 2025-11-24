import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./dashboard.css";

function Dashboard() {
  const [kegiatan, setKegiatan] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ====== LOAD USER FROM LOCAL STORAGE ======
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // fallback jika user belum login
      setUser({
        Nama: "Guest User",
        NIM: "000000",
      });
    }
  }, []);

  // ====== FETCH DATA DARI SERVER ======
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/kegiatan");
        setKegiatan(res.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data kegiatan:", err);
      }
    };

    fetchData();
  }, []);

  // ====== FORMAT TANGGAL ======
  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ====== FILTER & PEMISAHAN DATA ======
  const ongoingKegiatan = kegiatan.filter((item) => {
    const s = (item.StatusKegiatan || "").toLowerCase();

    return (
      s.includes("berlangsung")
    );
  });



  const rekomendasi = kegiatan.filter(
    (item) =>
      item.StatusKegiatan !== "Berlangsung" &&
      (filter === "Semua" || item.KategoriKegiatan === filter) &&
      item.NamaKegiatan.toLowerCase().includes(search.toLowerCase())
  );

  // ====== KATEGORI ======
  const kategoriList = ["Semua", "Event", "Seminar", "Webinar", "Organisasi", "Kompetisi", "Pelatihan"];

  // ====== LOGOUT ======
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar-custom">
        <div className="sidebar-header-custom">
          <img src="/mitu_bw.svg" alt="MITU Logo" style={{ maxWidth: "107px" }} />
        </div>

        <div className="sidebar-user-info">
          <div className="user-avatar-initial-large">
            {user ? user.Nama.charAt(0) : "U"}
          </div>
          <div className="user-detail-custom">
            <div className="user-name-custom">{user?.Nama}</div>
            <div className="user-nim-custom">{user?.NIM}</div>
          </div>
        </div>

        <hr className="menu-separator" />
        <div className="menu-label" style={{ fontSize: "14px" }}>Menu</div>

        <nav className="sidebar-nav-custom">
          <a href="#beranda" className="nav-link-custom active">
            <i className="bi bi-house-door-fill"></i><span>Beranda</span>
          </a>
          <a href="/myprofile" className="nav-link-custom">
            <i className="bi bi-person-fill"></i><span>Profil</span>
          </a>
        </nav>

        <div className="sidebar-footer-custom" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i><span>Keluar</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content-custom">
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

        <h1 className="main-title-custom">Beranda</h1>

        {/* KEGIATAN BERLANGSUNG */}
        <section className="section-berlangsung mb-5">
          <h2 className="section-title-custom">Kegiatan tengah berlangsung</h2>
          <div className="row g-3" style={{ paddingLeft: "50px" }}>
            {ongoingKegiatan.length > 0 ? (
              ongoingKegiatan.map((item) => (
                <div key={item.KegiatanID} className="col-12 col-lg-6">
                  <div className="card ongoing-card-custom">
                    <div className="ongoing-card-left">
                      <img
                        src="https://via.placeholder.com/200"
                        alt={item.NamaKegiatan}
                        className="ongoing-img"
                      />
                    </div>

                    <div className="ongoing-card-body">
                      <h5 className="ongoing-card-title">{item.NamaKegiatan}</h5>

                      <div className="info-rekomendasi category-info">
                        <span className="badge category-badge-rekomendasi">
                          {item.KategoriKegiatan}
                        </span>
                      </div>

                      <div className="ongoing-card-info">
                        <div className="info-item">
                          <i className="bi bi-calendar-event"></i>
                          <span>{formatDate(item.TglMulaiKegiatan)}</span>
                        </div>
                        <div className="info-item">
                          <i className="bi bi-geo-alt-fill"></i>
                          <span>{item.TempatKegiatan}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted ms-3">Tidak ada kegiatan yang sedang berlangsung.</p>
            )}
          </div>
        </section>

        <hr className="section-separator" />

        {/* REKOMENDASI */}
        <section className="section-rekomendasi">
          <div className="filter-buttons-custom mb-3" style={{ paddingLeft: "50px" }}>
            {kategoriList.map((cat) => (
              <button
                key={cat}
                className={`btn btn-filter-custom ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <h2 className="section-title-custom">Rekomendasi kegiatan</h2>

          <div className="row g-4 mb-3" style={{ paddingLeft: "50px" }}>
            {rekomendasi.length > 0 ? (
              rekomendasi.map((item) => (
                <div key={item.KegiatanID} className="col-lg-4 col-md-6">
                  <div className="card rekomendasi-card-custom">
                    <div className="card-header-rekomendasi">
                      <img
                        src="https://via.placeholder.com/200"
                        alt={item.NamaKegiatan}
                        className="card-img-rekomendasi"
                      />
                    </div>

                    <div className="card-body-rekomendasi">
                      <h5 className="card-title-rekomendasi">{item.NamaKegiatan}</h5>

                      <div className="info-rekomendasi">
                        <i className="bi bi-calendar-event"></i>
                        <span>{formatDate(item.TglMulaiKegiatan)}</span>
                      </div>

                      <div className="info-rekomendasi">
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>{item.TempatKegiatan}</span>
                      </div>

                      <div className="info-rekomendasi category-info">
                        <span className="badge category-badge-rekomendasi">
                          {item.KategoriKegiatan}
                        </span>
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
              <p className="text-muted ms-3">Tidak ada kegiatan ditemukan.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
