import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Import CSS
import "./dashboard.css"; // Digunakan untuk styling sidebar dan layout utama
import "./profile.css"; // Digunakan untuk styling konten utama Profil

function MyProfile() {
  const navigate = useNavigate();
  // State user akan menampung data user yang login
  const [user, setUser] = useState(null); 
  const [searchKegiatan, setSearchKegiatan] = useState("");

  // Mock data untuk Kegiatan Tersimpan (Tidak diubah, karena tidak terkait defaultUserDetail)
  const mockSavedActivities = [
    {
      KegiatanID: 1,
      NamaKegiatan: "Google Workshop: Prompting G...",
      Kategori: "Seminar",
      Tanggal: "20 Okt 2025",
      Lokasi: "Gedung Monterawu",
      Status: "Berlangsung",
    },
    {
      KegiatanID: 2,
      NamaKegiatan: "Bank Indonesia Goes to Campus",
      Kategori: "Event",
      Tanggal: "20 Okt 2025",
      Lokasi: "TULT LT.16",
      Status: "Berlangsung",
    },
    {
      KegiatanID: 3,
      NamaKegiatan: "table item",
      Kategori: "Pelatihan",
      Tanggal: "table item",
      Lokasi: "table item",
      Status: "Akan Datang",
    },
  ];
  
  const [filteredActivities, setFilteredActivities] = useState(mockSavedActivities);


  // Ambil data user HANYA dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Strukturkan data yang diharapkan dari localStorage
        const userData = {
          // Menggunakan operator OR (||) untuk memberikan fallback jika field tidak ada di localStorage
          NamaLengkap: parsedUser.NamaLengkap || parsedUser.Nama || null, 
          Username: parsedUser.Username || null,
          NIM_NIP: parsedUser.NIM_NIP || parsedUser.NIM || parsedUser.NIP || null,
          AlamatEmail: parsedUser.Email || null,
          PeranPengguna: parsedUser.Role || null,
        };
        setUser(userData);
    } else {
            // Jika tidak ada di localStorage, user tetap null atau diisi dengan struktur kosong
            setUser({}); 
        }
  }, []);

  // Filter Kegiatan Tersimpan
  useEffect(() => {
    const results = mockSavedActivities.filter(item =>
      item.NamaKegiatan.toLowerCase().includes(searchKegiatan.toLowerCase())
    );
    setFilteredActivities(results);
  }, [searchKegiatan, mockSavedActivities]); 

  // Fungsi Logout
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("user");
      navigate("/login"); 
    }
  };

    const removeSavedActivity = (id, nama) => {
        const isConfirmed = window.confirm(
            `Apakah Anda yakin ingin menghapus kegiatan "${nama}" dari daftar simpanan Anda?`
        );
        
        if (isConfirmed) {
            const updatedActivities = savedActivities.filter(item => item.KegiatanID !== id);
            setSavedActivities(updatedActivities);
            alert(`Kegiatan "${nama}" berhasil dihapus dari daftar simpanan.`);
        }
    };

  // ==============================================================================================
  // RENDER COMPONENT
  // ==============================================================================================
  return (
    <div className="dashboard-container">
      {/* ======================= */}
      {/* SIDEBAR */}
      {/* ======================= */}
      <aside className="sidebar-custom">
        <div className="sidebar-header-custom">
          {/* Ganti dengan path logo Anda */}
          <img src="/mitu_bw.svg" alt="MITU Logo" style={{maxWidth:'107px', maxHeight:'61px'}}/> 
        </div>

        {/* User Info di Atas Menu */}
        <div className="sidebar-user-info">
          <div className="user-avatar-initial-large">
            {/* Menggunakan NamaDepan atau NamaLengkap sebagai fallback */}
            {user?.NamaDepan?.charAt(0) || user?.NamaLengkap?.charAt(0) || "G"}
          </div>
          <div className="user-detail-custom">
            <div className="user-name-custom">
              {user?.NamaLengkap || "Nama User Tidak Tersedia"}
            </div>
            <div className="user-nim-custom">{user?.NIM_NIP || "NIM/NIP Tidak Tersedia"}</div> 
          </div>
        </div>
        <hr className="menu-separator" />
        <div className="menu-label" style={{fontSize:'14px'}}>Menu</div>

        {/* Navigasi Sidebar */}
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

        {/* Footer Logout */}
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

        {/* Section: Informasi Akun */}
        <section className="section-info-akun mb-5" style={{marginLeft: '50px'}}> 
          <h2 className="section-subtitle-custom">Informasi akun</h2>
          <div className="info-grid-container">
            
            {/* Nama Lengkap */}
            <div className="info-item-profile col-span-2">
              <span className="info-label">Nama Lengkap</span>
              <span className="info-value">{user?.NamaLengkap || "Tidak Tersedia"}</span>
            </div>
            
            {/* Username */}
            <div className="info-item-profile">
              <span className="info-label">Username</span>
              <span className="info-value">{user?.Username || "Tidak Tersedia"}</span>
            </div>

            {/* NIM/NIP */}
            <div className="info-item-profile col-span-2">
              <span className="info-label">NIM/NIP</span>
              <span className="info-value">{user?.NIM_NIP || "Tidak Tersedia"}</span>
            </div>
            
            {/* Alamat Email */}
            <div className="info-item-profile">
              <span className="info-label">Alamat Email</span>
              <span className="info-value">{user?.AlamatEmail || "Tidak Tersedia"}</span>
            </div>
            
            {/* Peran Pengguna */}
            <div className="info-item-profile">
              <span className="info-label">Peran Pengguna</span>
              <span className="info-value">{user?.PeranPengguna || "Tidak Tersedia"}</span>
            </div>

          </div>
        </section>

        {/* Section: Kegiatan Tersimpan */}
        <section className="section-kegiatan-tersimpan">
          <h2 className="section-title-custom">Kegiatan Tersimpan</h2>
          
          <div className="search-table-container" style={{marginLeft: '50px'}}>
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
          <div className="table-responsive-custom" style={{marginLeft: '50px'}}> 
            <table className="table saved-activities-table">
              <thead>
                <tr>
                  <th>Nama Kegiatan</th>
                  <th>Kategori</th>
                  <th>Tanggal</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((item) => (
                    <tr key={item.KegiatanID}>
                      <td>{item.NamaKegiatan}</td>
                      <td>
                        <span className={`badge category-badge-table category-${item.Kategori.toLowerCase()}`}>
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
                      <td>
                        <i 
                            className="bi bi-bookmark-check-fill action-icon text-danger" // Mengubah ikon menjadi trash dan warna menjadi merah
                            onClick={() => removeSavedActivity(item.KegiatanID, item.NamaKegiatan)}
                            style={{cursor: 'pointer'}}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">Tidak ada kegiatan tersimpan yang cocok.</td>
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

export default MyProfile;