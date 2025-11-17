import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./dashboardAdmin.css"; 
import TambahKegiatanModal from './TambahKegiatanModal';
import EditKegiatanModal from './EditKegiatanModal';

function DashboardAdmin() {
    const [semuaKegiatan, setSemuaKegiatan] = useState([]);
    const [search, setSearch] = useState("");
    const [userAdmin, setUserAdmin] = useState(null);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const [showModalEdit, setShowModalEdit] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    

    const handleSaveKegiatan = (newKegiatanData) => {
        console.log("Data Kegiatan Baru yang akan disimpan:", newKegiatanData);
    };

    const handleShowEdit = (kegiatanData) => {
        setDataToEdit(kegiatanData); 
        setShowModalEdit(true);
    };
    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
        setDataToEdit(null); 
    };

    const handleUpdateKegiatan = (id, updatedData) => {
        console.log(`Mengupdate Kegiatan ID ${id} dengan data:`, updatedData);

        setSemuaKegiatan(semuaKegiatan.map(item => 
            item.KegiatanID === id ? { ...item, ...updatedData } : item
        ));
        handleCloseModalEdit();
    };

    const handleEdit = (id) => {
        const kegiatan = semuaKegiatan.find(item => item.KegiatanID === id);
        if (kegiatan) {
            handleShowEdit({
                // Lakukan mapping agar sesuai dengan struktur form
                KegiatanID: kegiatan.KegiatanID,
                namaKegiatan: kegiatan.NamaKegiatan,
                deskripsi: kegiatan.Deskripsi || 'Deskripsi kegiatan...', // Asumsi properti Deskripsi ada
                status: kegiatan.Status,
                tanggalMulai: kegiatan.TglMulai,
                tanggalAkhir: kegiatan.TglAkhir,
                tempat: kegiatan.Lokasi, // Menggunakan Lokasi
                penyelenggara: kegiatan.Penyelenggara || '', // Asumsi properti Penyelenggara ada
                kategori: kegiatan.Kategori,
                tingkat: kegiatan.Tingkat || '', // Asumsi properti Tingkat ada
                ImageKegiatan: kegiatan.ImageKegiatan, // Nama/path file
                linkPendaftaran: kegiatan.LinkPendaftaran || ''
            });
        }
    };

    // Data Mock untuk Kegiatan Sedang Berlangsung (Admin Card)
    const mockOngoingAdmin = [
        {
            KegiatanID: 1,
            NamaKegiatan: "Google Workshop: Prompting Guide",
            Tipe: "Webinar",
            TglMulai: "2025-11-10",
            Lokasi: "TULT L 1.16",
            ImageKegiatan: "workshop_google.png",
        },
        {
            KegiatanID: 2,
            NamaKegiatan: "Bank Indonesia Goes to Campus",
            Tipe: "Event",
            TglMulai: "2025-11-10",
            Lokasi: "Gedung Mentarawu",
            ImageKegiatan: "bank_indonesia.png",
        },
    ];

    // Data Mock untuk Tabel Daftar Semua Kegiatan
    const mockTabelKegiatan = [
        {
            KegiatanID: 3,
            NamaKegiatan: "Google Workshop: Prompting Guide",
            Kategori: "Seminar",
            TglMulai: "2025-10-20",
            TglAkhir: "2025-10-20",
            Lokasi: "Gedung Monterawu",
            Status: "Berlangsung",
        },
        {
            KegiatanID: 4,
            NamaKegiatan: "table item",
            Kategori: "Workshop",
            TglMulai: "2025-10-25",
            TglAkhir: "2025-10-25",
            Lokasi: "table item",
            Status: "Berlangsung",
        },
        {
            KegiatanID: 5,
            NamaKegiatan: "table item",
            Kategori: "Pelatihan",
            TglMulai: "2025-11-01",
            TglAkhir: "2025-11-01",
            Lokasi: "table item",
            Status: "Akan Datang",
        },
        {
            KegiatanID: 6,
            NamaKegiatan: "table item",
            Kategori: "Workshop",
            TglMulai: "2025-11-05",
            TglAkhir: "2025-11-05",
            Lokasi: "table item",
            Status: "Akan Datang",
        },
        {
            KegiatanID: 7,
            NamaKegiatan: "table item",
            Kategori: "Kompetisi",
            TglMulai: "2025-09-15",
            TglAkhir: "2025-09-20",
            Lokasi: "table item",
            Status: "Selesai",
        },
    ];

    // Cek user admin login
    useEffect(() => {
        // Asumsi data admin disimpan di localStorage atau didapat dari API
        // Menggunakan data mock admin
        setUserAdmin({
            Nama: "MITU Admin",
            Email: "admin@telkomuniversity.ac.id",
        });
        setSemuaKegiatan(mockTabelKegiatan);
    }, []);

    // Fungsi untuk format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const options = { day: "numeric", month: "short", year: "numeric" };
        return date.toLocaleDateString("id-ID", options).replace('.', ''); // Menghilangkan titik pada bulan singkat
    };

    // Filter data tabel berdasarkan pencarian
    const filteredKegiatan = semuaKegiatan.filter((item) =>
        item.NamaKegiatan.toLowerCase().includes(search.toLowerCase())
    );

    // Fungsi untuk mendapatkan kelas badge status
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Berlangsung":
                return "badge-status-admin status-berlangsung";
            case "Akan Datang":
                return "badge-status-admin status-akan-datang";
            case "Selesai":
                return "badge-status-admin status-selesai";
            default:
                return "badge-status-admin";
        }
    };
    
    // Fungsi untuk mendapatkan kelas badge kategori
    const getKategoriBadgeClass = (kategori) => {
        switch (kategori) {
            case "Seminar":
                return "badge-kategori-admin kat-seminar";
            case "Workshop":
                return "badge-kategori-admin kat-workshop";
            case "Pelatihan":
                return "badge-kategori-admin kat-pelatihan";
            case "Kompetisi":
                return "badge-kategori-admin kat-kompetisi";
            default:
                return "badge-kategori-admin kat-default";
        }
    };

    // Fungsi Logout
    const handleLogout = () => {
        if (window.confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem("adminUser"); // Gunakan key yang berbeda untuk admin
            navigate("/admin/login");
        }
    };
    
    const handleDelete = (id) => {
        if (window.confirm(`Yakin ingin menghapus kegiatan ID ${id}?`)) {
            console.log("Hapus kegiatan ID:", id);
            // Logika penghapusan API di sini
        }
    };

    // RENDER COMPONENT
  
    return (
        <div className="admin-layout">
            {/* ======================= */}
            {/* SIDEBAR ADMIN (Kiri) */}
            {/* ======================= */}
            <aside className="sidebar-admin">
                <div className="sidebar-header-admin">
                    <img src="/mitu_bw.svg" alt="MITU Logo" style={{maxWidth:'107px', maxHeight:'61px'}}/>
                </div>
                <hr className="menu-separator" />
                 <div className="menu-label" style={{fontSize:'14px'}}>Menu</div>
                <nav className="sidebar-nav-admin">
                    <a href="#beranda" className="nav-item-admin active">
                        <i className="bi bi-house-door-fill"></i>
                        <span>Beranda</span>
                    </a>
                    <a href="/admin/kegiatan" className="nav-item-admin">
                        <i className="bi bi-calendar-check-fill"></i>
                        <span>Kegiatan</span>
                    </a>
                    <a href="/admin/users" className="nav-item-admin">
                        <i className="bi bi-people-fill"></i>
                        <span>Users</span>
                    </a>
                    <a href="/admin/kategori" className="nav-item-admin">
                        <i className="bi bi-tags-fill"></i>
                        <span>Kategori</span>
                    </a>
                    <a href="/admin/laporan" className="nav-item-admin">
                        <i className="bi bi-bar-chart-fill"></i>
                        <span>Laporan</span>
                    </a>
                </nav>

                {/* Admin Info di Bawah (Sesuai Gambar Admin Dashboard) */}
                <div className="sidebar-footer-admin">
                    <div className="admin-info">
                        <i className="bi bi-person-circle" style={{fontSize: '30px'}}></i>
                        <div>
                            <div className="admin-name">{userAdmin ? userAdmin.Nama : "Admin"}</div>
                            <div className="admin-email">
                                {userAdmin ? userAdmin.Email : "admin@email.com"}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ======================= */}
            {/* MAIN CONTENT ADMIN (Kanan) */}
            {/* ======================= */}
            <main className="main-content-admin">
                {/* Topbar (Search bar) */}
                <header className="topbar-admin">
                    <div className="search-bar-admin">
                        <input
                            type="text"
                            placeholder="Cari Kegiatan"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                <div className="content-container-admin">
                    <h1 className="dashboard-title-admin">Dashboard Admin</h1>
                    <p className="subtitle-admin">Kegiatan tengah berlangsung</p>

                    {/* Section: Kegiatan Tengah Berlangsung Cards */}
                    <div className="kegiatan-berlangsung-list">
                        {mockOngoingAdmin.map((item) => (
                            <div key={item.KegiatanID} className="kegiatan-card-admin">
                                <img
                                    src={`/images/${item.ImageKegiatan}`}
                                    alt={item.NamaKegiatan}
                                    className="card-image-admin"
                                />
                                <div className="card-content-admin">
                                    <div className={`card-badge-admin badge-${item.Tipe.toLowerCase()}`}>
                                        {item.Tipe}
                                    </div>
                                    <h5 className="card-title-admin">{item.NamaKegiatan}</h5>
                                    <div className="card-date-time-admin">
                                        <i className="bi bi-calendar-event"></i>
                                        <span>{formatDate(item.TglMulai)}</span>
                                    </div>
                                    <div className="card-date-time-admin">
                                        <i className="bi bi-geo-alt-fill"></i>
                                        <span>{item.Lokasi}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Section: Daftar Semua Kegiatan (Tabel) */}
                    <div className="daftar-kegiatan-section">
                        <div className="section-header-admin">
                            <h2 className="section-title-admin">Daftar Semua Kegiatan</h2>
                            <button className="btn-tambah-admin" onClick={handleShow}>
                                <i className="bi bi-plus-circle-fill"></i>
                                Tambah Kegiatan
                            </button>
                        </div>

                        <div className="table-wrapper">
                            <table className="kegiatan-table">
                                <thead>
                                    <tr>
                                        <th>NAMA KEGIATAN</th>
                                        <th>KATEGORI</th>
                                        <th>TANGGAL MULAI</th>
                                        <th>TANGGAL AKHIR</th>
                                        <th>LOKASI</th>
                                        <th>STATUS</th>
                                        <th>AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredKegiatan.map((item) => (
                                        <tr key={item.KegiatanID}>
                                            <td>{item.NamaKegiatan}</td>
                                            <td>
                                                <span className={getKategoriBadgeClass(item.Kategori)}>
                                                    {item.Kategori}
                                                </span>
                                            </td>
                                            <td>{formatDate(item.TglMulai)}</td>
                                            <td>{formatDate(item.TglAkhir)}</td>
                                            <td>{item.Lokasi}</td>
                                            <td>
                                                <span className={getStatusBadgeClass(item.Status)}>
                                                    {item.Status}
                                                </span>
                                            </td>
                                            <td className="aksi">
                                                <div className="aksi-buttons">
                                                    <button 
                                                        className="btn-aksi btn-edit" 
                                                        title="Edit"
                                                        onClick={() => handleEdit(item.KegiatanID)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button 
                                                        className="btn-aksi btn-delete" 
                                                        title="Hapus"
                                                        onClick={() => handleDelete(item.KegiatanID)}
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            {/* RENDER MODAL TAMBAH KEGIATAN */}
            <TambahKegiatanModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSubmit={handleSaveKegiatan}
            />
            {/* RENDER MODAL EDIT KEGIATAN (BARU) */}
            {dataToEdit && (
                <EditKegiatanModal
                    show={showModalEdit}
                    handleClose={handleCloseModalEdit}
                    handleUpdate={handleUpdateKegiatan}
                    initialData={dataToEdit}
                />
            )}
        </div>
    );
}

export default DashboardAdmin;