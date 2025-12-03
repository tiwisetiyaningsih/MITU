import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";


// Import CSS
import "./dashboard.css"; 
import "./profile.css"; 

function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [searchKegiatan, setSearchKegiatan] = useState("");

  const [activities, setActivities] = useState([]); 
  const [filteredActivities, setFilteredActivities] = useState([]); 

  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  const [showModal, setShowModal] = useState(false);


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
  // Menggunakan useCallback untuk stabilitas fungsi
  const fetchSavedActivities = useCallback(async (userID) => {
    if (!userID) return;
    try {
      setActivities([]); // Reset state
      
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
      
      const userID = parsedUser.UserID || parsedUser.id || null; 

      const userData = {
        UserID: userID,
        NamaLengkap: parsedUser.NamaLengkap || parsedUser.Nama || `${parsedUser.NamaDepan || ''} ${parsedUser.NamaBelakang || ''}`.trim() || null, 
        Username: parsedUser.Username || null,
        NIM_NIP: parsedUser.NIM || parsedUser.NIP || null,
        AlamatEmail: parsedUser.AlamatEmail || parsedUser.Email || null,
        PeranPengguna: parsedUser.PeranPengguna || parsedUser.Role || null,
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
        const res = await fetch(`http://localhost:5000/hapus-simpan-kegiatan`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            UserID: user.UserID,
            KegiatanID: kegiatanID
          })
        });

        const data = await res.json(); // HARUS diambil sebagai JSON karena server mengirim JSON

        if (res.ok && data.success) {
          alert(`Kegiatan "${namaKegiatan}" berhasil dihapus dari daftar simpanan.`);
          fetchSavedActivities(user.UserID);
        } else {
          throw new Error(data.message || "Terjadi kesalahan.");
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

  if (!user) {
      return (
        <div className="dashboard-container">
            <main className="main-content-custom profile-page-custom">
                <h1 className="main-title-custom">Memuat Profil...</h1>
            </main>
        </div>
      );
  }

 
  // RENDER COMPONENT
  return (
    <div className="dashboard-container">
      {/* ======================= SIDEBAR ======================= */}
      <aside className="sidebar-custom">
        <div className="sidebar-header-custom">
          <img src="/mitu_bw.svg" alt="MITU Logo" style={{maxWidth:'107px', maxHeight:'61px'}}/> 
        </div>

        <div className="sidebar-user-info">
          <div className="user-avatar-initial-large">
            {user?.NamaDepan?.charAt(0) || user?.NamaLengkap?.charAt(0) || "!"}
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

      {/* ======================= MAIN CONTENT (Kanan) - PROFIL ======================= */}
      <main className="main-content-custom profile-page-custom">
        
        <h1 className="main-title-custom">Profil</h1>

        {/* Section: Informasi Akun */}
        <section className="section-info-akun mb-5" style={{marginLeft: '50px'}}> 
          <h2 className="section-subtitle-custom">Informasi akun</h2>
          <div className="info-grid-container">
            
            <div className="info-item-profile col-span-2">
              <span className="info-label">Nama Lengkap</span>
              <span className="info-value">{user?.NamaLengkap || "Tidak Tersedia"}</span>
            </div>
            
            <div className="info-item-profile">
              <span className="info-label">Username</span>
              <span className="info-value">{user?.Username || "Tidak Tersedia"}</span>
            </div>

            <div className="info-item-profile col-span-2">
              <span className="info-label">NIM/NIP</span>
              <span className="info-value">{user?.NIM_NIP || "Tidak Tersedia"}</span>
            </div>
            
            <div className="info-item-profile">
              <span className="info-label">Alamat Email</span>
              <span className="info-value">{user?.AlamatEmail || "Tidak Tersedia"}</span>
            </div>
            
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
                  <th>No</th>
                  <th>Gambar</th>
                  <th>Nama Kegiatan</th>
                  <th>Kategori</th>
                  <th>Tanggal</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((item, index) => (
                    <tr key={item.KegiatanID}>
                      <td>{index + 1}</td>
                      <td>
                        {item.ImageKegiatan ? (
                          <img
                              src={`http://localhost:5000/uploads/${item.ImageKegiatan}`}
                              alt={item.NamaKegiatan}
                              style={{width: '50px', height:'50px'}}
                          />
                      ) : (
                          <div style={{width: '50px', height:'50px'}}>
                              No Image
                          </div>
                      )}
                      </td>
                      <td>{item.NamaKegiatan}</td>
                      <td>
                        <span className={`badge category-badge-table category-${item.KategoriKegiatan?.toLowerCase()}`}>
                          {item.KategoriKegiatan}
                        </span>
                      </td>
                      <td>{formatDate(item.TglMulaiKegiatan)}</td>
                      <td>{item.TempatKegiatan}</td>
                      <td>
                        <span className={`badge status-badge-table status-${item.StatusKegiatan?.toLowerCase().replace(/\s/g, '')}`}>
                          {item.StatusKegiatan}
                        </span>
                      </td>
                      <td className="text-center">
                        <i 
                          className="bi bi-eye-fill action-icon text-primary me-2"
                          title="Lihat Detail Kegiatan"
                          onClick={() => getDetailKegiatan(item.KegiatanID)}
                          style={{ cursor: 'pointer' }}
                        ></i>

                        <i 
                            className="bi bi-bookmark-x-fill action-icon text-danger" 
                            title="Hapus Kegiatan Tersimpan"
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

export default MyProfile;