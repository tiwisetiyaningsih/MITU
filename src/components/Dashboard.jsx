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
  const [saved, setSaved] = useState({});
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  const [showModal, setShowModal] = useState(false);



  // ====== LOAD USER FROM LOCAL STORAGE ======
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // fallback jika user belum login
      setUser({
        Nama: "Memuat...",
        NIM: "Memuat...",
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

  useEffect(() => {
    if (!user || !user.UserID) return;

    const fetchSaved = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/kegiatan-tersimpan/${user.UserID}`);

        // buat map dari KegiatanID → true
        const savedMap = {};
        res.data.forEach((item) => {
          savedMap[item.KegiatanID] = true;
        });

        setSaved(savedMap);  
      } catch (err) {
        console.error("❌ Error ambil kegiatan tersimpan:", err);
      }
    };

    fetchSaved();
  }, [user]);



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



  const rekomendasi = kegiatan.filter((item) =>
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

  // ====== SIMPAN KEGIATAN ======
  const simpanKegiatan = async (kegiatanID) => {
    if (!user || !user.UserID) {
      alert("Harap login terlebih dahulu");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/simpan-kegiatan", {
        UserID: user.UserID,
        KegiatanID: kegiatanID,
      });

      if (res.data.success) {
        setSaved((prev) => ({ ...prev, [kegiatanID]: true }));

        alert(res.data.already ? "📌 Kegiatan sudah pernah disimpan" : "✅ Kegiatan berhasil disimpan!");
      }
    } catch (err) {
      console.error("Error simpan:", err);
      alert("Terjadi kesalahan saat menyimpan kegiatan");
    }
  };

// ====== LIHAT DETAIL KEGIATAN ======
const getDetailKegiatan = async (id) => {
  try {
    const res = await axios.get(`http://localhost:5000/detail-kegiatan/${id}`);

    if (res.data.success) {
      setSelectedKegiatan(res.data.data);
      setShowModal(true);
    }
  } catch (err) {
    console.error("❌ Error detail kegiatan:", err);
    alert("Gagal mengambil detail kegiatan");
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
        <section className="section-berlangsung mb-4">
          <h2 className="section-title-custom">Kegiatan tengah berlangsung</h2>
          <div className="row g-3" style={{ paddingLeft: "50px"}}>
            {ongoingKegiatan.length > 0 ? (
              ongoingKegiatan.map((item) => (
                <div key={item.KegiatanID} className="col-12 col-lg-4">
                  <div className="card ongoing-card-custom">
                    <div className="ongoing-card-left">
                      {item.ImageKegiatan ? (
                          <img
                              src={`http://localhost:5000/uploads/${item.ImageKegiatan}`}
                              alt={item.NamaKegiatan}
                              className="ongoing-img"
                          />
                      ) : (
                          <div className="no-image-box">
                              No Image
                          </div>
                      )}
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

          <div className="row g-4 mb-3 pe-5" style={{ paddingLeft: "50px" }}>
            {rekomendasi.length > 0 ? (
              rekomendasi.map((item) => (
                <div key={item.KegiatanID} className="col-lg-3 col-md-6">
                  <div className="card rekomendasi-card-custom">
                    <div className="card-header-rekomendasi">
                      {item.ImageKegiatan ? (
                          <img
                              src={`http://localhost:5000/uploads/${item.ImageKegiatan}`}
                              alt={item.NamaKegiatan}
                              className="card-img-rekomendasi"
                          />
                      ) : (
                          <div className="no-image-box">No Image</div>
                      )}
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
                      <button
                        className="btn btn-lihat-custom"
                        onClick={() => getDetailKegiatan(item.KegiatanID)}
                      >
                        Lihat
                      </button>

                      <i
                        className={`bi bookmark-icon ${saved[item.KegiatanID] ? "bi-bookmark-fill" : "bi-bookmark"}`}
                        onClick={() => simpanKegiatan(item.KegiatanID)}
                        style={{ cursor: "pointer" }}
                      ></i>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted ms-3">Tidak ada kegiatan ditemukan.</p>
            )}
          </div>
        </section>

        {/* ================= MODAL DETAIL KEGIATAN ================= */}
        {showModal && selectedKegiatan && (
          <div className="modal-overlay">
            <div className="modal-card">

              <div className="modal-header">
                <h3>{selectedKegiatan.NamaKegiatan}</h3>
                <i
                  className="bi bi-x-lg close-icon"
                  onClick={() => setShowModal(false)}
                ></i>
              </div>

              {/* Gambar Tetap */}
              <div className="modal-image-wrapper">
                <img
                  src={`http://localhost:5000/uploads/${selectedKegiatan.ImageKegiatan}`}
                  alt={selectedKegiatan.NamaKegiatan}
                  className="modal-image"
                />
              </div>

              {/* Bagian scroll */}
              <div className="modal-scroll-content" style={{marginLeft:'15px', marginRight:'15px'}}>

                <p><strong>Deskripsi:</strong><br />{selectedKegiatan.DeskripsiKegiatan}</p>

                <p><strong>Status:</strong> {selectedKegiatan.StatusKegiatan}</p>

                <p><strong>Tanggal Mulai:</strong><br />
                  {formatDate(selectedKegiatan.TglMulaiKegiatan)}
                </p>

                <p><strong>Tanggal Selesai:</strong><br />
                  {formatDate(selectedKegiatan.TglAkhirKegiatan)}
                </p>

                <p><strong>Tempat:</strong> {selectedKegiatan.TempatKegiatan}</p>

                <p><strong>Penyelenggara:</strong> {selectedKegiatan.PenyelenggaraKegiatan}</p>

                <p><strong>Kategori:</strong> {selectedKegiatan.KategoriKegiatan}</p>

                <p><strong>Tingkat:</strong> {selectedKegiatan.TingkatKegiatan}</p>

              </div>
              <div className="text-center mt-3 mb-3">
                  <a
                    href={
                      selectedKegiatan.LinkPendaftaran.startsWith("http")
                        ? selectedKegiatan.LinkPendaftaran
                        : "https://" + selectedKegiatan.LinkPendaftaran
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-lihat-custom"
                    style={{ padding: "10px 30px" }}
                  >
                    Buka Link Pendaftaran
                  </a>
                </div>
            </div>
          </div>
        )}


      </main>
    </div>
  );
}

export default Dashboard;
