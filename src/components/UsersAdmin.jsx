import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Import Gaya
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./users.css"; 
// Import Modal (Anda perlu membuat komponen ini)
import EditUserModal from './EditUserModal'; 

// ======================================
// Konfigurasi API
// ======================================
const API_BASE_URL = 'http://localhost:5000'; 

function UsersAdmin() {
    const [semuaUsers, setSemuaUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [userAdmin, setUserAdmin] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State untuk Modal Edit
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);

    // ======================================
    // FUNGSI PENGAMBILAN DATA USERS (Fetch API)
    // ======================================
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            // Mengurutkan data (misalnya berdasarkan Role atau UserID)
            setSemuaUsers(response.data);
        } catch (err) {
            console.error("❌ Error fetching users:", err);
            setError(`Gagal mengambil data pengguna dari ${API_BASE_URL}/users. Pastikan backend berjalan.`);
            setSemuaUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // HOOKS
    // ======================================
    useEffect(() => {
        const storedUser = localStorage.getItem("user"); 
        
        if (storedUser) {
             const adminData = JSON.parse(storedUser);
             setUserAdmin(adminData);
        } else {
             setUserAdmin({
                Nama: "Admin Panel",
                Email: "admin@telkomuniversity.ac.id",
             });
        }
        
        fetchUsers();
    }, [navigate]);


    // ======================================
    // FUNGSI UTILITY (FILTER & STATISTIK)
    // ======================================
    
    // Hitung statistik peran (role)
    const roleStats = useMemo(() => {
        return semuaUsers.reduce((acc, user) => {
            const role = user.Role || 'Lainnya';
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {
            Dosen: 0,
            Mahasiswa: 0,
            Admin: 0,
            Lainnya: 0
        });
    }, [semuaUsers]);

    // Filter pengguna untuk tabel
    const filteredUsers = semuaUsers.filter((user) => {
        const searchLower = search.toLowerCase();
        return (
            (user.Nama && user.Nama.toLowerCase().includes(searchLower)) || 
            (user.Email && user.Email.toLowerCase().includes(searchLower)) ||
            (user.NIM && user.NIM.includes(search)) ||
            (user.NIP && user.NIP.includes(search))
        );
    });

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "Dosen": return "badge-role-dosen";
            case "Mahasiswa": return "badge-role-mahasiswa";
            case "Admin": return "badge-role-admin";
            default: return "badge-role-default";
        }
    };
    
    const getStatusAkunBadgeClass = (status) => {
        switch (status) {
            case "Aktif": return "badge-status-aktif";
            case "Nonaktif": return "badge-status-nonaktif";
            default: return "badge-status-default";
        }
    };


    // ======================================
    // FUNGSI CRUD
    // ======================================
    
    // Logic untuk menampilkan modal edit
    const handleEdit = (id) => {
        const user = semuaUsers.find(item => item.UserID === id);
        if (user) {
            setDataToEdit(user);
            setShowModalEdit(true);
        }
    };

    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
        setDataToEdit(null);
        fetchUsers(); // Refresh data setelah update
    };

    // Logic untuk Update (API: PUT /users/:id)
    const handleUpdate = async (id, updatedData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/${id}`, updatedData);
            if (response.data.success) {
                alert(response.data.message);
                handleCloseModalEdit();
            }
        } catch (error) {
            console.error("❌ Error updating user:", error);
            alert("Gagal mengupdate user! Cek konsol dan status server.");
        }
    };
    
    // Logic untuk Hapus (API: DELETE /users/:id)
    const handleDelete = async (id) => {
        const user = semuaUsers.find(item => item.UserID === id)?.Nama;
        if (window.confirm(`Yakin ingin menghapus pengguna "${user}" (ID: ${id})?`)) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
                if (response.data.success) {
                    alert(response.data.message);
                    fetchUsers(); // Refresh daftar setelah hapus
                }
            } catch (error) {
                console.error("❌ Error deleting user:", error);
                alert("Gagal menghapus user! Cek konsol dan status server.");
            }
        }
    };
    
    const handleAddUser = () => {
        alert("Fungsi Tambah Pengguna akan membuka modal.");
        // Implementasi modal Tambah Pengguna di sini
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
                    <a href="/admin/kegiatan" className="nav-item-admin">
                        <i className="bi bi-calendar-check-fill"></i>
                        <span>Kegiatan</span>
                    </a>
                    <a href="/admin/users" className="nav-item-admin active">
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
                            placeholder="Cari Nama, Email, NIM, atau NIP"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                <div className="content-container-admin">
                    <h1 className="dashboard-title-admin">Users</h1>
                    <p className="subtitle-admin">Manajemen dan statistik pengguna</p>

                    {/* STATISTIK PERAN PENGGUNA */}
                    <div className="role-statistik-wrapper">
                        <RoleCard title="Admin" count={roleStats.Admin} color="#d90000" />
                        <RoleCard title="Dosen" count={roleStats.Dosen} color="#007bff" />
                        <RoleCard title="Mahasiswa" count={roleStats.Mahasiswa} color="#28a745" />
                        <RoleCard title="Total Pengguna" count={semuaUsers.length} color="#6c757d" />
                    </div>
                    {/* END STATISTIK */}
                    
                    {/* DAFTAR SEMUA USERS (Tabel) */}
                    <div className="daftar-users-section">
                        <div className="section-header-admin">
                            <h2 className="section-title-admin">Daftar Semua Pengguna</h2>
                            <button className="btn-tambah-admin" onClick={handleAddUser}>
                                <i className="bi bi-person-plus-fill"></i>
                                Tambah Pengguna
                            </button>
                        </div>

                        {loading && <p className="text-center p-4">Sedang memuat data...</p>}
                        {error && <div className="alert alert-warning text-center">{error}</div>}

                        {!loading && !error && (
                            <div className="table-wrapper">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>NAMA</th>
                                            <th>EMAIL</th>
                                            <th>ROLE</th>
                                            <th>NIM</th>
                                            <th>NIP</th>
                                            <th>STATUS AKUN</th>
                                            <th>AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((item) => (
                                                <tr key={item.UserID}>
                                                    <td>{item.Nama}</td>
                                                    <td>{item.Email}</td>
                                                    <td>
                                                        <span className={`badge-role ${getRoleBadgeClass(item.Role)}`}>
                                                            {item.Role}
                                                        </span>
                                                    </td>
                                                    <td>{item.NIM || '-'}</td>
                                                    <td>{item.NIP || '-'}</td>
                                                    <td>
                                                        <span className={`badge-status ${getStatusAkunBadgeClass(item.StatusAkun)}`}>
                                                            {item.StatusAkun}
                                                        </span>
                                                    </td>
                                                    <td className="aksi">
                                                        <div className="aksi-buttons">
                                                            <button
                                                                className="btn-aksi btn-edit"
                                                                title="Edit"
                                                                onClick={() => handleEdit(item.UserID)}
                                                            >
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button
                                                                className="btn-aksi btn-delete"
                                                                title="Hapus"
                                                                onClick={() => handleDelete(item.UserID)}
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
                                                    Tidak ada pengguna yang ditemukan.
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
            
            {/* RENDER MODAL EDIT */}
            {dataToEdit && (
                <EditUserModal
                    show={showModalEdit}
                    handleClose={handleCloseModalEdit}
                    handleUpdate={handleUpdate}
                    initialData={dataToEdit}
                />
            )}
        </div>
    );
}

const RoleCard = ({ title, count, color }) => (
    <div className="role-card" style={{ borderColor: color }}>
        <h3 className="role-card-title">{title}</h3>
        <p className="role-card-count" style={{ color: color }}>
            {count}
        </p>
    </div>
);

export default UsersAdmin;