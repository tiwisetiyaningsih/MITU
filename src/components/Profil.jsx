import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Import CSS
import "./dashboard.css"; 
import "./profile.css"; 

function Profil() {
  const navigate = useNavigate();
  // State user akan menampung data user yang login
  const [user, setUser] = useState(null); 
  const [searchKegiatan, setSearchKegiatan] = useState("");

  // Data Mock Detail User Lengkap (Digunakan sebagai fallback jika localStorage kosong)
  const defaultUserDetail = {
    NamaDepan: "Gisela",
    NamaBelakang: "Senaria Kusthika Putri",
    NIM: "103912300331",
    TanggalLahir: "10-09-2005",
    AlamatEmail: "selasesariakp@student.telkomuniversity.ac.id",
    NomorTelepon: "-",
    PeranPengguna: "Mahasiswa",
  };

  // Mock data untuk Kegiatan Tersimpan (Tetap di sini)
  const mockSavedActivities = [
    {
      KegiatanID: 1,
      NamaKegiatan: "Google Workshop: Prompting G...",
      Kategori: "Seminar",
      Tanggal: "20 Okt 2025",
      Lokasi: "Gedung Monterawu",
      Status: "Berlangsung",
      Peserta: "50/100",
    },
    {
      KegiatanID: 2,
      NamaKegiatan: "Bank Indonesia Goes to Campus",
      Kategori: "Event",
      Tanggal: "20 Okt 2025",
      Lokasi: "TULT LT.16",
      Status: "Berlangsung",
      Peserta: "240/300",
    },
    {
      KegiatanID: 3,
      NamaKegiatan: "table item",
      Kategori: "Pelatihan",
      Tanggal: "table item",
      Lokasi: "table item",
      Status: "Akan Datang",
      Peserta: "30/50",
    },
  ];
  
  const [filteredActivities, setFilteredActivities] = useState(mockSavedActivities);


  // Ambil data user dari localStorage / Set Default Mock User
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Jika ada di localStorage, gunakan data itu
      setUser(JSON.parse(storedUser));
    } else {
      // Jika tidak ada (simulasi login), gunakan default mock
      setUser(defaultUserDetail);
    }
  }, []);

  // Filter Kegiatan Tersimpan
  useEffect(() => {
    const results = mockSavedActivities.filter(item =>
      item.NamaKegiatan.toLowerCase().includes(searchKegiatan.toLowerCase())
    );
    setFilteredActivities(results);
  }, [searchKegiatan]);

  // Fungsi Logout
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // ==============================================================================================
  // RENDER COMPONENT
  // ==============================================================================================
  return (
    <div className="dashboard-container">
      {/* ======================= */}
      {/* SIDEBAR (Kiri) */}
      {/* ======================= */}
      <aside className="sidebar-custom">
        <div className="sidebar-header-custom center-logo">
          <img src="./assets/mitu_bw.svg" alt="MITU Logo" className="logo-svg" />
        </div>

        <div className="sidebar-user-info-new">
          <div className="user-avatar-initial-new">
            {/* Mengambil huruf pertama dari Nama Depan */}
            {user ? user.NamaDepan.charAt(0) : "G"} 
          </div>
          <div className="user-detail-custom">
            <div className="user-name-custom">
              {/* Menggabungkan Nama Depan dan Belakang */}
              {user ? `${user.NamaDepan} ${user.NamaBelakang}` : "Gisela Senaria Kusthika Putri"}
            </div>
            <div className="user-nim-custom">{user ? user.NIM : "103912300331"}</div>
          </div>
        </div>

        <div className="menu-label-new">MENU</div>

        <nav className="sidebar-nav-custom">
          <a href="/dashboard" className="nav-link-custom">
            <i className="bi bi-house-door-fill"></i>
            <span>Beranda</span>
          </a>
          <a href="/profile" className="nav-link-custom active">
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
      {/* MAIN CONTENT (Kanan) - PROFIL */}
      {/* ======================= */}
      <main className="main-content-custom profile-page-custom">
        
        <h1 className="main-title-custom">Profil</h1>

        {/* Section: Informasi Akun (MENGGUNAKAN STATE 'user') */}
        <section className="section-info-akun mb-5">
            <h2 className="section-subtitle-custom">Informasi akun</h2>
            <div className="info-grid-container">
                
                {/* Baris 1 */}
                <div className="info-item-profile">
                    <span className="info-label">Nama Depan</span>
                    <span className="info-value">{user?.NamaDepan || "Memuat..."}</span>
                </div>
                <div className="info-item-profile">
                    <span className="info-label">Nama Belakang</span>
                    <span className="info-value">{user?.NamaBelakang || "Memuat..."}</span>
                </div>
                <div className="info-item-profile">
                    <span className="info-label">Tanggal Lahir</span>
                    <span className="info-value">{user?.TanggalLahir || "Memuat..."}</span>
                </div>

                {/* Baris 2 */}
                <div className="info-item-profile">
                    <span className="info-label">Alamat Email</span>
                    <span className="info-value">{user?.AlamatEmail || "Memuat..."}</span>
                </div>
                <div className="info-item-profile">
                    <span className="info-label">Nomor Telepon</span>
                    <span className="info-value">{user?.NomorTelepon || "Memuat..."}</span>
                </div>
                <div className="info-item-profile">
                    <span className="info-label">Peran Pengguna</span>
                    <span className="info-value">{user?.PeranPengguna || "Memuat..."}</span>
                </div>

            </div>
        </section>

        {/* Section: Kegiatan Tersimpan */}
        <section className="section-kegiatan-tersimpan">
            <h2 className="section-title-custom">Kegiatan Tersimpan</h2>
            
            <div className="search-table-container">
                <i className="bi bi-search"></i>
                <input
                    type="text"
                    className="form-control-table-search"
                    placeholder="Cari Kegiatan"
                    value={searchKegiatan}
                    onChange={(e) => setSearchKegiatan(e.target.value)}
                />
            </div>

            {/* Table Kegiatan */}
            <div className="table-responsive-custom">
                <table className="table saved-activities-table">
                    <thead>
                        <tr>
                            <th>Nama Kegiatan</th>
                            <th>Kategori</th>
                            <th>Tanggal</th>
                            <th>Lokasi</th>
                            <th>Status</th>
                            <th>Peserta</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((item) => (
                                <tr key={item.KegiatanID}>
                                    <td>{item.NamaKegiatan}</td>
                                    <td>
                                        <span className={`badge category-badge-table ${item.Kategori.toLowerCase()}`}>
                                            {item.Kategori}
                                        </span>
                                    </td>
                                    <td>{item.Tanggal}</td>
                                    <td>{item.Lokasi}</td>
                                    <td>
                                        <span className={`badge status-badge-table status-${item.Status.toLowerCase().replace(/\s/g, '')}`}>
                                            {item.Status}
                                        </span>
                                    </td>
                                    <td>{item.Peserta}</td>
                                    <td>
                                        <i className="bi bi-check-lg action-icon"></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-muted">Tidak ada kegiatan tersimpan yang cocok.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </section>

      </main>
    </div>
  );
}

export default Profil;