import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Import CSS
import "./dashboard.css"; 
import "./profile.css"; 

function MyProfile() {
  const navigate = useNavigate();
  // State user akan menampung data user yang login
  const [user, setUser] = useState(null); 
  const [searchKegiatan, setSearchKegiatan] = useState("");

  // STATE BARU: Menggantikan mockSavedActivities dengan data dari API
  const [activities, setActivities] = useState([]); 
  // filteredActivities akan diisi dari state activities
  const [filteredActivities, setFilteredActivities] = useState([]); 


  // ===================================
  // FUNGSI: FORMAT TANGGAL
  // ===================================
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const cleanDateString = dateString.split('T')[0];
      const date = new Date(cleanDateString);
      if (isNaN(date.getTime())) return dateString; 

      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const formatted = date.toLocaleDateString('id-ID', options).replace(/\./g, ''); 
      return formatted;
    } catch (e) {
      return dateString; 
    }
  };


  // ===================================
  // FUNGSI: AMBIL DATA DARI BACKEND
  // ===================================
  const fetchSavedActivities = useCallback(async (userID) => {
    if (!userID) return;
    try {
      setActivities([]); // Reset state
      
      // Mengambil data kegiatan tersimpan dari API backend
      const res = await fetch(`http://localhost:5000/kegiatan-tersimpan/${userID}`);
      
      if (!res.ok) {
        throw new Error(`Gagal mengambil data kegiatan. Status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
         setActivities(data); // Simpan data dari backend
      } else {
         console.warn("Data kegiatan tersimpan bukan dalam format array:", data);
         setActivities([]);
      }
      
    } catch (err) {
      console.error("Error fetch kegiatan:", err);
    }
  }, []); 


  // ===================================
  // SIDE EFFECT: MUAT PENGGUNA DAN DATA
  // ===================================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Ambil UserID yang dibutuhkan untuk fetch kegiatan
      const userID = parsedUser.UserID || parsedUser.id || null; 

      // Strukturkan data user
      const userData = {
        UserID: userID,
        NamaLengkap: parsedUser.NamaLengkap || parsedUser.Nama || `${parsedUser.NamaDepan || ''} ${parsedUser.NamaBelakang || ''}`.trim() || null, 
        Username: parsedUser.Username || null,
        NIM_NIP: parsedUser.NIM || parsedUser.NIP || null,
        AlamatEmail: parsedUser.AlamatEmail || parsedUser.Email || null,
        PeranPengguna: parsedUser.PeranPengguna || parsedUser.Role || null,
        NamaDepan: parsedUser.NamaDepan || parsedUser.NamaLengkap?.charAt(0) || "G",
      };
      
      setUser(userData);
      
      // Panggil fungsi fetch kegiatan
      if (userID) {
        fetchSavedActivities(userID);
      }
    } else {
       setUser(null);
       navigate("/login"); 
    }
  }, [navigate, fetchSavedActivities]); 

  
  // ===================================
  // FUNGSI: FILTER DAN PENCARIAN
  // ===================================
  useEffect(() => {
    // Menggunakan state 'activities' yang diisi dari backend
    const results = activities.filter(item =>
      item.NamaKegiatan?.toLowerCase().includes(searchKegiatan.toLowerCase())
    );
    setFilteredActivities(results);
  }, [searchKegiatan, activities]); 


  // ===================================
  // FUNGSI: HAPUS KEGIATAN (API DELETE)
  // ===================================
  const handleDeleteActivity = async (kegiatanID, namaKegiatan) => {
    if (!user || !user.UserID) {
      alert("Detail pengguna tidak ditemukan. Tidak dapat menghapus kegiatan.");
      return;
    }

    if (!kegiatanID) {
        alert("ID Kegiatan tidak valid.");
        return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus kegiatan "${namaKegiatan}" dari daftar simpanan?`)) {
      try {
        const res = await fetch(`http://localhost:5000/kegiatan-tersimpan/${user.UserID}/${kegiatanID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          alert(`Kegiatan "${namaKegiatan}" berhasil dihapus dari daftar simpanan.`);
          // Muat ulang data
          fetchSavedActivities(user.UserID);
        } else {
          const errorData = await res.json().catch(() => ({ message: 'Gagal menghapus (respon non-JSON).' }));
          throw new Error(errorData.message || `Gagal menghapus kegiatan. Status: ${res.status}`);
        }
      } catch (err) {
        console.error("Error delete kegiatan:", err);
        alert(`Gagal menghapus kegiatan: ${err.message}`);
      }
    }
  };


  // Fungsi Logout
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("user");
      navigate("/login"); 
    }
  };


  if (!user) {
      return (
        <div className="dashboard-container">
            <main className="main-content-custom profile-page-custom">
                <h1 className="main-title-custom">Memuat Profil...</h1>
            </main>
        </div>
      );
  }

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
            {user.NamaDepan?.charAt(0) || user.NamaLengkap?.charAt(0) || "G"}
          </div>
          <div className="user-detail-custom">
            <div className="user-name-custom">
              {user.NamaLengkap || "Nama User Tidak Tersedia"}
            </div>
            <div className="user-nim-custom">{user.NIM_NIP || "NIM/NIP Tidak Tersedia"}</div> 
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
              <span className="info-value">{user.NamaLengkap || "Tidak Tersedia"}</span>
            </div>
            
            {/* Username */}
            <div className="info-item-profile">
              <span className="info-label">Username</span>
              <span className="info-value">{user.Username || "Tidak Tersedia"}</span>
            </div>

            {/* NIM/NIP */}
            <div className="info-item-profile col-span-2">
              <span className="info-label">NIM/NIP</span>
              <span className="info-value">{user.NIM_NIP || "Tidak Tersedia"}</span>
            </div>
            
            {/* Alamat Email */}
            <div className="info-item-profile">
              <span className="info-label">Alamat Email</span>
              <span className="info-value">{user.AlamatEmail || "Tidak Tersedia"}</span>
            </div>
            
            {/* Peran Pengguna */}
            <div className="info-item-profile">
              <span className="info-label">Peran Pengguna</span>
              <span className="info-value">{user.PeranPengguna || "Tidak Tersedia"}</span>
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
                        {/* MENGGUNAKAN KEY DARI JSON: KategoriKegiatan */}
                        <span className={`badge category-badge-table category-${item.KategoriKegiatan?.toLowerCase()}`}>
                          {item.KategoriKegiatan}
                        </span>
                      </td>
                      {/* MENGGUNAKAN KEY DARI JSON: TglMulaiKegiatan */}
                      <td>{formatDate(item.TglMulaiKegiatan)}</td> 
                      {/* MENGGUNAKAN KEY DARI JSON: TempatKegiatan */}
                      <td>{item.TempatKegiatan}</td> 
                      <td>
                        {/* MENGGUNAKAN KEY DARI JSON: StatusKegiatan */}
                        <span className={`badge status-badge-table status-${item.StatusKegiatan?.toLowerCase().replace(/\s/g, '')}`}>
                          {item.StatusKegiatan}
                        </span>
                      </td>
                      <td>
                        <i 
                          className="bi bi-trash-fill action-icon text-danger" 
                          title="Hapus Kegiatan Tersimpan"
                          // Memanggil fungsi DELETE yang baru
                          onClick={() => handleDeleteActivity(item.KegiatanID, item.NamaKegiatan)}
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