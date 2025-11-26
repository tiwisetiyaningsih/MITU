import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./kegiatan.css"; 
import TambahKegiatanModal from './TambahKegiatanModal';
import EditKegiatanModal from './EditKegiatanModal';

// ======================================
// Konfigurasi API 
// ======================================
const API_BASE_URL = 'http://localhost:5000'; 

// Warna untuk Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d90000', '#00bcd4', '#ffc107'];
const bulanNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// ======================================
// FUNGSI UTILITY BARU: MEMPROSES DATA UNTUK CHART
// ======================================
const processDataForCharts = (data) => {
    // 1. Data Kegiatan per Bulan (Bar Chart)
    const monthlyCount = {};
    const currentYear = new Date().getFullYear();

    data.forEach(item => {
        const date = new Date(item.TglMulaiKegiatan);
        const year = date.getFullYear();
        // Hanya hitung kegiatan di tahun berjalan
        if (year === currentYear) {
            const monthIndex = date.getMonth(); 
            const monthKey = bulanNames[monthIndex];
            monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1;
        }
    });

    // Buat array 12 bulan, pastikan urutan dan inisialisasi nol
    const dataMonthly = bulanNames.map(month => ({
        bulan: month,
        jumlah: monthlyCount[month] || 0
    }));

    // 2. Data Distribusi Kategori (Pie Chart)
    const categoryCount = {};
    data.forEach(item => {
        const kategori = item.KategoriKegiatan || 'Tidak Berkategori';
        categoryCount[kategori] = (categoryCount[kategori] || 0) + 1;
    });

    const dataCategory = Object.keys(categoryCount).map(kategori => ({
        name: kategori,
        value: categoryCount[kategori]
    }));

    return { dataMonthly, dataCategory, currentYear };
};


// ======================================
// KOMPONEN UTAMA
// ======================================
function Kegiatan() {
    // State untuk data dan UI
    const [semuaKegiatan, setSemuaKegiatan] = useState([]);
    const [search, setSearch] = useState("");
    const [userAdmin, setUserAdmin] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State untuk Modal
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);

    // Proses data untuk Chart menggunakan useMemo agar hanya dihitung ulang jika data kegiatan berubah
    const { dataMonthly, dataCategory, currentYear } = useMemo(() => processDataForCharts(semuaKegiatan), [semuaKegiatan]);

    // ======================================
    // FUNGSI PENGAMBILAN DATA KEGIATAN (Fetch)
    // ======================================
    const fetchKegiatan = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/kegiatan`);
            const sortedData = response.data.sort((a, b) => new Date(b.TglMulaiKegiatan) - new Date(a.TglMulaiKegiatan));
            setSemuaKegiatan(sortedData); 
        } catch (err) {
            console.error("Error fetching kegiatan:", err);
            setError(`Gagal mengambil data kegiatan dari ${API_BASE_URL}/kegiatan. Pastikan backend berjalan.`);
            setSemuaKegiatan([]);
        } finally {
            setLoading(false);
        }
    };

    // ... (FUNGSI HOOKS & UTILITY lainnya tetap sama) ...
    // ======================================
    // HOOKS: Mengambil Data Admin dan Kegiatan
    // ======================================
    useEffect(() => {
        const storedUser = localStorage.getItem("user"); 
        
        if (storedUser) {
             const adminData = JSON.parse(storedUser);
             setUserAdmin(adminData);
        } else {
             // Default Admin Info jika tidak ada user di localStorage
             setUserAdmin({
                 Nama: "Memuat...",
                 Email: "Memuat...",
             });
        }
        
        fetchKegiatan();
    }, [navigate]);

    // ======================================
    // FUNGSI UTILITY (FORMAT & FILTER)
    // ======================================
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const options = { day: "numeric", month: "short", year: "numeric" };
        return date.toLocaleDateString("id-ID", options).replace('.', '');
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Berlangsung": return "badge-status-admin status-berlangsung";
            case "Akan Datang": return "badge-status-admin status-akan-datang";
            case "Selesai": return "badge-status-admin status-selesai";
            default: return "badge-status-admin";
        }
    };
    
    const getKategoriBadgeClass = (kategori) => {
        switch (kategori) {
            case "Seminar": return "kat-seminar";
            case "Webinar": return "kat-webinar";
            case "Pelatihan": return "kat-pelatihan";
            case "Kompetisi": return "kat-kompetisi";
            case "Organisasi": return "kat-organisasi"; 
            case "Event": return "kat-event"; 
            case "UKM": return "kat-ukm"; 
            case "Workshop": return "kat-workshop"; 
            default: return "kat-default";
        }
    };
    
    // Filter kegiatan berdasarkan input search
    const filteredKegiatan = semuaKegiatan.filter((item) =>
        item.NamaKegiatan.toLowerCase().includes(search.toLowerCase())
    );

    // ======================================
    // FUNGSI MODAL & CRUD
    // ======================================
    const handleCloseModal = () => {
        setShowModal(false);
        fetchKegiatan(); // Refresh data setelah tambah
    }
    
    const handleSaveKegiatan = async (newKegiatanData) => {
        // Logika POST API di sini
        try {
            // Ganti dengan API nyata
            // const response = await axios.post(`${API_BASE_URL}/kegiatan`, newKegiatanData);
            // alert(response.data.message);
            alert("Kegiatan berhasil ditambahkan (Simulasi POST)");
            handleCloseModal();
        } catch (error) {
            console.error("Error saving kegiatan:", error);
            alert("Gagal menyimpan kegiatan!");
        }
    };

    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
        setDataToEdit(null);
        fetchKegiatan(); // Refresh data setelah edit
    };

    const handleUpdateKegiatan = async (id, updatedData) => {
        // Logika PUT API di sini
        try {
             // Ganti dengan API nyata
             // const response = await axios.put(`${API_BASE_URL}/kegiatan/${id}`, updatedData);
             // alert(response.data.message);
            alert(`Kegiatan ID ${id} berhasil diupdate (Simulasi PUT)`);
            handleCloseModalEdit();
        } catch (error) {
            console.error("Error updating kegiatan:", error);
            alert("Gagal mengupdate kegiatan!");
        }
    };

    const handleEdit = (id) => {
        const kegiatan = semuaKegiatan.find(item => item.KegiatanID === id);
        
        if (kegiatan) {
            handleShowEdit({
                KegiatanID: kegiatan.KegiatanID,
                namaKegiatan: kegiatan.NamaKegiatan, 
                deskripsi: kegiatan.DeskripsiKegiatan || '', 
                status: kegiatan.StatusKegiatan, 
                // Pastikan format tanggal sesuai input modal (YYYY-MM-DD)
                tanggalMulai: new Date(kegiatan.TglMulaiKegiatan).toISOString().split('T')[0],
                tanggalAkhir: new Date(kegiatan.TglAkhirKegiatan).toISOString().split('T')[0],
                tempat: kegiatan.TempatKegiatan, 
                penyelenggara: kegiatan.PenyelenggaraKegiatan || '', 
                kategori: kegiatan.KategoriKegiatan, 
                tingkat: kegiatan.TingkatKegiatan || '', 
                ImageKegiatan: kegiatan.ImageKegiatan, 
                linkPendaftaran: kegiatan.LinkPendaftaran || ''
            });
        }
    };
    
    const handleShowEdit = (kegiatanData) => {
        setDataToEdit(kegiatanData);
        setShowModalEdit(true);
    };
    
    const handleDelete = async (id) => {
        const nama = semuaKegiatan.find(item => item.KegiatanID === id)?.NamaKegiatan;
        if (window.confirm(`Yakin ingin menghapus kegiatan "${nama}" (ID: ${id})?`)) {
            try {
                alert(`Kegiatan ID ${id} berhasil dihapus (Simulasi DELETE)`);
                setSemuaKegiatan(semuaKegiatan.filter(item => item.KegiatanID !== id));
            } catch (error) {
                console.error("Error deleting kegiatan:", error);
                alert("Gagal menghapus kegiatan!");
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) {
            localStorage.removeItem("user"); 
            navigate("/login");
        }
    };

    // ======================================
    // RENDER COMPONENT
    // ======================================
    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="sidebar-admin">
                <div className="sidebar-header-admin">
                    <img src="/mitu_bw.svg" alt="MITU Logo" style={{ maxWidth: "107px" }} />
                </div>
                
                <nav className="sidebar-nav-admin">
                    <a href="/dashboardAdmin" className="nav-item-admin">
                        <i className="bi bi-house-door-fill"></i>
                        <span>Beranda</span>
                    </a>
                    <a href="/admin/kegiatan" className="nav-item-admin active">
                        <i className="bi bi-calendar-check-fill"></i>
                        <span>Kegiatan</span>
                    </a>
                    <a href="/admin/users" className="nav-item-admin">
                        <i className="bi bi-people-fill"></i>
                        <span>Users</span>
                    </a>
                </nav>

                <div className="sidebar-footer-admin" onClick={handleLogout} title="Keluar">
                    <div className="admin-info">
                        <i className="bi bi-person-circle" style={{fontSize: '30px'}}></i>
                        <div>
                            <div className="admin-name">{userAdmin ? userAdmin.Nama : "Memuat..."}</div>
                            <div className="admin-email">
                                {userAdmin ? (userAdmin.Email || "email@admin.com") : "Memuat..."}
                            </div>
                        </div>
                    </div>
                    <i className="bi bi-box-arrow-right" style={{marginLeft:'auto', fontSize:'20px'}}></i>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content-admin" style={{marginLeft: '250px'}}> 
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
                    <h1 className="dashboard-title-admin">Kegiatan</h1>
                    <p className="subtitle-admin">Informasi dan statistik kegiatan</p>

                    {/* STATISTIK KEGIATAN (CHART/GRAFIK) */}
                    <div className="kegiatan-statistik-wrapper">
                        
                        {/* 1. Jumlah Kegiatan per Bulan (Bar Chart) */}
                        <div className="statistik-card">
                            <h2 className="statistik-title">Jumlah Kegiatan per Bulan ({currentYear})</h2>
                            <div className="chart-container">
                                {semuaKegiatan.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dataMonthly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="bulan" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip formatter={(value) => [`${value} Kegiatan`, 'Jumlah']} />
                                            <Legend />
                                            <Bar dataKey="jumlah" fill="#d90000" name="Jumlah Kegiatan" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-muted text-center p-5">Tidak ada data kegiatan di tahun ini untuk ditampilkan.</p>
                                )}
                            </div>
                        </div>

                        {/* 2. Distribusi Kategori Kegiatan (Pie Chart) */}
                        <div className="statistik-card">
                            <h2 className="statistik-title">Distribusi Kategori Kegiatan</h2>
                            <div className="chart-container">
                                {semuaKegiatan.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={dataCategory}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            >
                                                {dataCategory.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value, name, props) => [`${value} Kegiatan`, props.payload.name]} />
                                            {/* Legend di bawah chart */}
                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                     <p className="text-muted text-center p-5">Tidak ada data kategori untuk ditampilkan.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* END STATISTIK KEGIATAN */}
                    
                    {/* DAFTAR SEMUA KEGIATAN (Tabel) */}
                    <div className="daftar-kegiatan-section">
                        <div className="section-header-admin">
                            <h2 className="section-title-admin">Daftar Semua Kegiatan</h2>
                            <button className="btn-tambah-admin" onClick={handleShow}>
                                <i className="bi bi-plus-circle-fill"></i>
                                Tambah Kegiatan
                            </button>
                        </div>

                        {loading && <p className="text-center p-4">Sedang memuat data...</p>}
                        {error && <div className="alert alert-warning text-center">{error}</div>}

                        {/* Tabel hanya ditampilkan jika tidak loading dan tidak error */}
                        {!loading && !error && (
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
                                        {filteredKegiatan.length > 0 ? (
                                            filteredKegiatan.map((item) => (
                                                <tr key={item.KegiatanID}>
                                                    <td>{item.NamaKegiatan}</td>
                                                    <td>
                                                        <span className={`badge-kategori-admin ${getKategoriBadgeClass(item.KategoriKegiatan)}`}>
                                                            {item.KategoriKegiatan}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(item.TglMulaiKegiatan)}</td>
                                                    <td>{formatDate(item.TglAkhirKegiatan)}</td>
                                                    <td>{item.TempatKegiatan}</td>
                                                    <td>
                                                        <span className={getStatusBadgeClass(item.StatusKegiatan)}>
                                                            {item.StatusKegiatan}
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
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center p-3">
                                                    Tidak ada kegiatan yang ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {/* RENDER MODAL */}
            <TambahKegiatanModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSubmit={handleSaveKegiatan}
            />
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

export default Kegiatan;