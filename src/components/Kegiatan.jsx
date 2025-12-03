import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./kegiatan.css"; 

// ======================================
// Konfigurasi API 
// ======================================
const API_BASE_URL = 'http://localhost:5000'; 

// Warna untuk Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d90000', '#00bcd4', '#ffc107'];
const bulanNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// ======================================
// FUNGSI UTILITY MEMPROSES DATA UNTUK CHART
// ======================================
const processDataForCharts = (data) => {
    const monthlyCount = {};
    const currentYear = new Date().getFullYear();

    data.forEach(item => {
        const date = new Date(item.TglMulaiKegiatan);
        if (date.getFullYear() === currentYear) {
            const monthKey = bulanNames[date.getMonth()];
            monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1;
        }
    });

    const dataMonthly = bulanNames.map(month => ({
        bulan: month,
        jumlah: monthlyCount[month] || 0
    }));

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



function Kegiatan() {
    const [semuaKegiatan, setSemuaKegiatan] = useState([]);
    const [search, setSearch] = useState("");
    const [userAdmin, setUserAdmin] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State Modal
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);

    const { dataMonthly, dataCategory, currentYear } = useMemo(() => processDataForCharts(semuaKegiatan), [semuaKegiatan]);

    // ======================================
    // FETCH KEGIATAN
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

    useEffect(() => {
        const storedUser = localStorage.getItem("user"); 
        if (storedUser) {
             setUserAdmin(JSON.parse(storedUser));
        } else {
             setUserAdmin({ Nama: "Memuat...", Email: "Memuat..." });
        }
        fetchKegiatan();
    }, [navigate]);

    // ======================================
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }).replace('.', '');
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
            default: return "kat-default";
        }
    };

    const filteredKegiatan = semuaKegiatan.filter(item =>
        item.NamaKegiatan.toLowerCase().includes(search.toLowerCase())
    );

    // ======================================
    // MODAL TAMBAH KEGIATAN
    // ======================================
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({});
    };

    // ======================================
    // MODAL TAMBAH KEGIATAN — FIXED
    // ======================================
    const handleSaveKegiatan = async () => {
        try {
            const fd = new FormData();

            fd.append("UserID", userAdmin.UserID);
            fd.append("NamaKegiatan", formData.NamaKegiatan);
            fd.append("KategoriKegiatan", formData.KategoriKegiatan);
            fd.append("TglMulaiKegiatan", formData.TglMulaiKegiatan);
            fd.append("TglAkhirKegiatan", formData.TglAkhirKegiatan);
            fd.append("DeskripsiKegiatan", formData.DeskripsiKegiatan);
            fd.append("StatusKegiatan", formData.StatusKegiatan);
            fd.append("TingkatKegiatan", formData.TingkatKegiatan);
            fd.append("TempatKegiatan", formData.TempatKegiatan);
            fd.append("PenyelenggaraKegiatan", formData.PenyelenggaraKegiatan);
            fd.append("LinkPendaftaran", formData.LinkPendaftaran);

            if (formData.ImageKegiatan) {
                fd.append("ImageKegiatan", formData.ImageKegiatan);
            }

            const res = await axios.post(`${API_BASE_URL}/kegiatan`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                alert("Kegiatan berhasil ditambahkan!");
                fetchKegiatan();
                handleCloseModal();
            } else {
                alert("Gagal menambahkan kegiatan.");
            }

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat menambahkan kegiatan.");
        }
    };


    // ======================================
    // MODAL EDIT KEGIATAN — FIXED
    // ======================================
    const handleShowEdit = (kegiatan) => {
        setDataToEdit({
            ...kegiatan,
            tanggalMulai: kegiatan.TglMulaiKegiatan?.substring(0, 10),
            tanggalAkhir: kegiatan.TglAkhirKegiatan?.substring(0, 10),
        });
        setShowModalEdit(true);
    };

    const handleUpdateKegiatan = async () => {
        try {
            const fd = new FormData();
            fd.append("NamaKegiatan", dataToEdit.NamaKegiatan);
            fd.append("KategoriKegiatan", dataToEdit.KategoriKegiatan);
            fd.append("TglMulaiKegiatan", dataToEdit.tanggalMulai);
            fd.append("TglAkhirKegiatan", dataToEdit.tanggalAkhir);
            fd.append("DeskripsiKegiatan", dataToEdit.DeskripsiKegiatan);
            fd.append("StatusKegiatan", dataToEdit.StatusKegiatan);
            fd.append("TingkatKegiatan", dataToEdit.TingkatKegiatan);
            fd.append("TempatKegiatan", dataToEdit.TempatKegiatan);
            fd.append("PenyelenggaraKegiatan", dataToEdit.PenyelenggaraKegiatan);
            fd.append("LinkPendaftaran", dataToEdit.LinkPendaftaran);

            if (dataToEdit.ImageKegiatan instanceof File) {
                fd.append("ImageKegiatan", dataToEdit.ImageKegiatan);
            }

            const res = await axios.put(`${API_BASE_URL}/kegiatan/${dataToEdit.KegiatanID}`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                alert("Kegiatan berhasil diperbarui!");
                fetchKegiatan();
                setShowModalEdit(false);
            }

        } catch (err) {
            console.log(err);
            alert("Gagal mengupdate kegiatan.");
        }
    };


    // ======================================
    // DELETE KEGIATAN — FIXED
    // ======================================
    const handleDelete = async (id) => {
        const nama = semuaKegiatan.find(item => item.KegiatanID === id)?.NamaKegiatan;

        if (!window.confirm(`Yakin ingin menghapus kegiatan "${nama}"?`)) return;

        try {
            const res = await axios.delete(`${API_BASE_URL}/kegiatan/${id}`);

            if (res.data.success) {
                alert("Kegiatan berhasil dihapus!");
                setSemuaKegiatan(prev => prev.filter(item => item.KegiatanID !== id));
            }

        } catch (err) {
            console.error(err);
            alert("Gagal menghapus kegiatan.");
        }
    };



    // ======================================
    // LOGOUT
    // ======================================
    const handleLogout = () => {
        if (window.confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    // ======================================
    // RENDER
    // ======================================
    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="sidebar-admin">
                <div className="sidebar-header-admin">
                    <img src="/mitu_bw.svg" alt="MITU Logo" style={{ maxWidth: "107px" }} />
                </div>
                <nav className="sidebar-nav-admin">
                    <a href="/dashboardAdmin" className="nav-item-admin"><i className="bi bi-house-door-fill"></i><span>Beranda</span></a>
                    <a href="/admin/kegiatan" className="nav-item-admin active"><i className="bi bi-calendar-check-fill"></i><span>Kegiatan</span></a>
                    <a href="/admin/users" className="nav-item-admin"><i className="bi bi-people-fill"></i><span>Users</span></a>
                </nav>
                <div className="sidebar-footer-admin" onClick={handleLogout} title="Keluar">
                    <div className="admin-info">
                        <i className="bi bi-person-circle" style={{fontSize: '30px'}}></i>
                        <div>
                            <div className="admin-name">{userAdmin?.Nama || "Memuat..."}</div>
                            <div className="admin-email">{userAdmin?.Email || "email@admin.com"}</div>
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

                    {/* Statistik Charts */}
                    <div className="kegiatan-statistik-wrapper">
                        {/* Bar Chart */}
                        <div className="statistik-card">
                            <h2 className="statistik-title">Jumlah Kegiatan per Bulan ({currentYear})</h2>
                            <div className="chart-container">
                                {semuaKegiatan.length ? (
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
                                ) : (<p className="text-muted text-center p-5">Tidak ada data kegiatan.</p>)}
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="statistik-card">
                            <h2 className="statistik-title">Distribusi Kategori Kegiatan</h2>
                            <div className="chart-container">
                                {semuaKegiatan.length ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={dataCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} (${(percent*100).toFixed(0)}%)`}>
                                                {dataCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip formatter={(value, name, props) => [`${value} Kegiatan`, props.payload.name]} />
                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (<p className="text-muted text-center p-5">Tidak ada data kategori.</p>)}
                            </div>
                        </div>
                    </div>

                    {/* Daftar Kegiatan */}
                    <div className="daftar-kegiatan-section">
                        <div className="section-header-admin">
                            <h2 className="section-title-admin">Daftar Semua Kegiatan</h2>
                            <button className="btn-tambah-admin" onClick={() => setShowModal(true)}><i className="bi bi-plus-circle-fill"></i>Tambah Kegiatan</button>
                        </div>

                        {loading && <p className="text-center p-4">Sedang memuat data...</p>}
                        {error && <div className="alert alert-warning text-center">{error}</div>}

                        {!loading && !error && (
                            <div className="table-wrapper">
                                <table className="kegiatan-table">
                                    <thead>
                                        <tr>
                                            <th>NO</th>
                                            <th>GAMBAR</th>
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
                                        {filteredKegiatan.length ? filteredKegiatan.map((item, index) => (
                                            <tr key={item.KegiatanID}>
                                                <td>{index + 1}</td>
                                                <td style={{alignItems:'center', justifyContent:'center'}}>
                                                    {item.ImageKegiatan ? (
                                                        <img
                                                            src={`http://localhost:5000/uploads/${item.ImageKegiatan}`}
                                                            alt={item.NamaKegiatan}
                                                            style={{width:'50px', height:'50px'}}
                                                        />
                                                    ) : (
                                                        <p className="text-center">
                                                            No Image
                                                        </p>
                                                    )}
                                                </td>
                                                <td>{item.NamaKegiatan}</td>
                                                <td><span className={`badge-kategori-admin ${getKategoriBadgeClass(item.KategoriKegiatan)}`}>{item.KategoriKegiatan}</span></td>
                                                <td>{formatDate(item.TglMulaiKegiatan)}</td>
                                                <td>{formatDate(item.TglAkhirKegiatan)}</td>
                                                <td>{item.TempatKegiatan}</td>
                                                <td><span className={getStatusBadgeClass(item.StatusKegiatan)}>{item.StatusKegiatan}</span></td>
                                                <td className="aksi">
                                                    <div className="aksi-buttons">
                                                        <button className="btn-aksi btn-edit" onClick={() => handleShowEdit(item)}><i className="bi bi-pencil-square"></i></button>
                                                        <button className="btn-aksi btn-delete" onClick={() => handleDelete(item.KegiatanID)}><i className="bi bi-trash-fill"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="7" className="text-center p-3">Tidak ada kegiatan yang ditemukan.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* MODAL TAMBAH KEGIATAN */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Form onSubmit={(e) => { e.preventDefault(); handleSaveKegiatan(); }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Kegiatan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Nama Kegiatan</Form.Label>
                                <Form.Control type="text" value={formData.NamaKegiatan || ""} onChange={e => setFormData({...formData, NamaKegiatan: e.target.value})} required/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Kategori</Form.Label>
                                <Form.Select value={formData.KategoriKegiatan || ""} onChange={e => setFormData({...formData, KategoriKegiatan: e.target.value})}>
                                    <option value="">Pilih Kategori</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Webinar">Webinar</option>
                                    <option value="Pelatihan">Pelatihan</option>
                                    <option value="Kompetisi">Kompetisi</option>
                                    <option value="Organisasi">Organisasi</option>
                                    <option value="Event">Event</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Tanggal Mulai</Form.Label>
                                <Form.Control type="date" value={formData.TglMulaiKegiatan || ""} onChange={e => setFormData({...formData, TglMulaiKegiatan: e.target.value})} required/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Tanggal Akhir</Form.Label>
                                <Form.Control type="date" value={formData.TglAkhirKegiatan || ""} onChange={e => setFormData({...formData, TglAkhirKegiatan: e.target.value})} />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.DeskripsiKegiatan || ""} onChange={e => setFormData({...formData, DeskripsiKegiatan: e.target.value})}/>
                        </Form.Group>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Status</Form.Label>
                                <Form.Select value={formData.StatusKegiatan || ""} onChange={e => setFormData({...formData, StatusKegiatan: e.target.value})}>
                                    <option value="">Pilih Status</option>
                                    <option value="Akan Datang">Akan Datang</option>
                                    <option value="Berlangsung">Berlangsung</option>
                                    <option value="Selesai">Selesai</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Tingkat</Form.Label>
                                <Form.Control type="text" value={formData.TingkatKegiatan || ""} onChange={e => setFormData({...formData, TingkatKegiatan: e.target.value})}/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Tempat</Form.Label>
                                <Form.Control type="text" value={formData.TempatKegiatan || ""} onChange={e => setFormData({...formData, TempatKegiatan: e.target.value})}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Penyelenggara</Form.Label>
                                <Form.Control type="text" value={formData.PenyelenggaraKegiatan || ""} onChange={e => setFormData({...formData, PenyelenggaraKegiatan: e.target.value})}/>
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Link Pendaftaran</Form.Label>
                            <Form.Control type="url" value={formData.LinkPendaftaran || ""} onChange={e => setFormData({...formData, LinkPendaftaran: e.target.value})}/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Gambar Kegiatan</Form.Label>
                            <Form.Control type="file" onChange={e => setFormData({...formData, ImageKegiatan: e.target.files[0]})}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Batal</Button>
                        <Button variant="primary" type="submit">Simpan</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL EDIT KEGIATAN */}
            <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)} size="lg" centered>
                <Form onSubmit={(e) => { e.preventDefault(); handleUpdateKegiatan(); }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Kegiatan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {dataToEdit && (
                            <>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Nama Kegiatan</Form.Label>
                                        <Form.Control type="text" value={dataToEdit.NamaKegiatan || ""} onChange={e => setDataToEdit({...dataToEdit, NamaKegiatan: e.target.value})} required/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Kategori</Form.Label>
                                        <Form.Select value={dataToEdit.KategoriKegiatan || ""} onChange={e => setDataToEdit({...dataToEdit, KategoriKegiatan: e.target.value})}>
                                            <option value="">Pilih Kategori</option>
                                            <option value="Seminar">Seminar</option>
                                            <option value="Webinar">Webinar</option>
                                            <option value="Pelatihan">Pelatihan</option>
                                            <option value="Kompetisi">Kompetisi</option>
                                            <option value="Organisasi">Organisasi</option>
                                            <option value="Event">Event</option>

                                        </Form.Select>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Tanggal Mulai</Form.Label>
                                        <Form.Control type="date" value={dataToEdit.tanggalMulai || ""} onChange={e => setDataToEdit({...dataToEdit, tanggalMulai: e.target.value})} required/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Tanggal Akhir</Form.Label>
                                        <Form.Control type="date" value={dataToEdit.tanggalAkhir || ""} onChange={e => setDataToEdit({...dataToEdit, tanggalAkhir: e.target.value})}/>
                                    </Form.Group>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Deskripsi</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={dataToEdit.DeskripsiKegiatan || ""} onChange={e => setDataToEdit({...dataToEdit, DeskripsiKegiatan: e.target.value})}/>
                                </Form.Group>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select value={dataToEdit.StatusKegiatan || ""} onChange={e => setDataToEdit({...dataToEdit, StatusKegiatan: e.target.value})}>
                                            <option value="">Pilih Status</option>
                                            <option value="Akan Datang">Akan Datang</option>
                                            <option value="Berlangsung">Berlangsung</option>
                                            <option value="Selesai">Selesai</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Tingkat</Form.Label>
                                        <Form.Control type="text" value={dataToEdit.TingkatKegiatan || ""} onChange={e => setDataToEdit({...dataToEdit, TingkatKegiatan: e.target.value})}/>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Tempat</Form.Label>
                                        <Form.Control type="text" value={dataToEdit.TempatKegiatan || ""} onChange={e => setDataToEdit({...dataToEdit, TempatKegiatan: e.target.value})}/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Penyelenggara</Form.Label>
                                        <Form.Control type="text" value={dataToEdit.PenyelenggaraKegiatan || ""} onChange={e => setDataToEdit({...dataToEdit, PenyelenggaraKegiatan: e.target.value})}/>
                                    </Form.Group>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Link Pendaftaran</Form.Label>
                                    <Form.Control type="url" value={dataToEdit.LinkPendaftaran || ""} onChange={e => setDataToEdit({...dataToEdit, LinkPendaftaran: e.target.value})}/>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Gambar Kegiatan</Form.Label>
                                    <Form.Control type="file" onChange={e => setDataToEdit({...dataToEdit, ImageKegiatan: e.target.files[0]})}/>
                                </Form.Group>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModalEdit(false)}>Batal</Button>
                        <Button variant="primary" type="submit">Update</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default Kegiatan;
