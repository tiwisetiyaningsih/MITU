import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Grid, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X,
  Menu,
  UserCircle
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardAdmin() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kegiatan, setKegiatan] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, nama: 'Ahmad Fauzi', role: 'Admin', email: 'ahmad.fauzi@telkomuniversity.ac.id' },
    { id: 2, nama: 'Siti Nurhaliza', role: 'Admin', email: 'siti.nurhaliza@telkomuniversity.ac.id' },
    { id: 3, nama: 'Budi Santoso', role: 'Staff', email: 'budi.santoso@telkomuniversity.ac.id' },
    { id: 4, nama: 'Dewi Lestari', role: 'Staff', email: 'dewi.lestari@telkomuniversity.ac.id' }
  ]);
  const [kategoriList, setKategoriList] = useState([
    { id: 1, nama: 'Akademik', deskripsi: 'Kegiatan terkait akademik dan pembelajaran' },
    { id: 2, nama: 'Seminar', deskripsi: 'Seminar dan talkshow' },
    { id: 3, nama: 'Workshop', deskripsi: 'Pelatihan dan workshop' },
    { id: 4, nama: 'Kompetisi', deskripsi: 'Kompetisi dan lomba' },
    { id: 5, nama: 'Olahraga', deskripsi: 'Kegiatan olahraga' },
    { id: 6, nama: 'Seni & Budaya', deskripsi: 'Kegiatan seni dan budaya' },
    { id: 7, nama: 'Kemahasiswaan', deskripsi: 'Kegiatan kemahasiswaan' }
  ]);

  const [formData, setFormData] = useState({
    namaKegiatan: '',
    kategori: '',
    tanggalMulai: '',
    tanggalAkhir: '',
    lokasi: '',
    status: '',
    penyelenggara: '',
    tingkatKegiatan: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Load sample data on mount
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        namaKegiatan: 'Workshop Web Development',
        kategori: 'Workshop',
        tanggalMulai: '2025-11-15',
        tanggalAkhir: '2025-11-16',
        lokasi: 'Lab Komputer FIT',
        status: 'Akan Datang',
        penyelenggara: 'HMIF',
        tingkatKegiatan: 'Fakultas'
      },
      {
        id: 2,
        namaKegiatan: 'Seminar Teknologi AI',
        kategori: 'Seminar',
        tanggalMulai: '2025-11-10',
        tanggalAkhir: '2025-11-11',
        lokasi: 'Auditorium Telkom',
        status: 'Aktif',
        penyelenggara: 'BTIC',
        tingkatKegiatan: 'Universitas'
      },
      {
        id: 3,
        namaKegiatan: 'Kompetisi Hackathon 2025',
        kategori: 'Kompetisi',
        tanggalMulai: '2025-10-20',
        tanggalAkhir: '2025-10-22',
        lokasi: 'Gedung Bangkit',
        status: 'Selesai',
        penyelenggara: 'DIT',
        tingkatKegiatan: 'Nasional'
      },
      {
        id: 4,
        namaKegiatan: 'Dies Natalis Tel-U',
        kategori: 'Kemahasiswaan',
        tanggalMulai: '2025-12-01',
        tanggalAkhir: '2025-12-05',
        lokasi: 'Lapangan Parkir',
        status: 'Akan Datang',
        penyelenggara: 'BEM',
        tingkatKegiatan: 'Universitas'
      },
      {
        id: 5,
        namaKegiatan: 'Turnamen Futsal',
        kategori: 'Olahraga',
        tanggalMulai: '2025-11-08',
        tanggalAkhir: '2025-11-12',
        lokasi: 'GOR Telkom',
        status: 'Aktif',
        penyelenggara: 'UKM Olahraga',
        tingkatKegiatan: 'Universitas'
      }
    ];
    setKegiatan(sampleData);
  }, []);

  // Statistics
  const totalKegiatan = kegiatan.length;
  const kegiatanAktif = kegiatan.filter(k => k.status === 'Aktif').length;
  const kegiatanAkanDatang = kegiatan.filter(k => k.status === 'Akan Datang').length;
  const kegiatanSelesai = kegiatan.filter(k => k.status === 'Selesai').length;

  // Chart Data
  const getMonthlyData = () => {
    const monthlyCount = {};
    kegiatan.forEach(k => {
      const month = new Date(k.tanggalMulai).toLocaleDateString('id-ID', { month: 'short' });
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    });
    return Object.keys(monthlyCount).map(month => ({
      bulan: month,
      jumlah: monthlyCount[month]
    }));
  };

  const getCategoryData = () => {
    const categoryCount = {};
    kegiatan.forEach(k => {
      categoryCount[k.kategori] = (categoryCount[k.kategori] || 0) + 1;
    });
    return Object.keys(categoryCount).map(kategori => ({
      name: kategori,
      value: categoryCount[kategori]
    }));
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setKegiatan(prev => prev.map(k => 
        k.id === editingId ? { ...formData, id: editingId } : k
      ));
      setEditingId(null);
    } else {
      setKegiatan(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    
    setFormData({
      namaKegiatan: '',
      kategori: '',
      tanggalMulai: '',
      tanggalAkhir: '',
      lokasi: '',
      status: '',
      penyelenggara: '',
      tingkatKegiatan: ''
    });
  };

  const handleEdit = (id) => {
    const item = kegiatan.find(k => k.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      setKegiatan(prev => prev.filter(k => k.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({
      namaKegiatan: '',
      kategori: '',
      tanggalMulai: '',
      tanggalAkhir: '',
      lokasi: '',
      status: '',
      penyelenggara: '',
      tingkatKegiatan: ''
    });
    setEditingId(null);
  };

  // User handlers
  const handleAddUser = () => {
    const nama = prompt('Masukkan nama user:');
    if (nama) {
      const email = prompt('Masukkan email:');
      const role = prompt('Masukkan role (Admin/Staff):');
      if (email && role) {
        setUsers(prev => [...prev, {
          id: Date.now(),
          nama,
          email,
          role
        }]);
      }
    }
  };

  const handleEditUser = (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
      const nama = prompt('Edit nama user:', user.nama);
      if (nama) {
        setUsers(prev => prev.map(u => 
          u.id === id ? { ...u, nama } : u
        ));
      }
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  // Kategori handlers
  const handleAddKategori = () => {
    const nama = prompt('Masukkan nama kategori:');
    if (nama) {
      const deskripsi = prompt('Masukkan deskripsi:');
      if (deskripsi) {
        setKategoriList(prev => [...prev, {
          id: Date.now(),
          nama,
          deskripsi
        }]);
      }
    }
  };

  const handleEditKategori = (id) => {
    const kat = kategoriList.find(k => k.id === id);
    if (kat) {
      const nama = prompt('Edit nama kategori:', kat.nama);
      if (nama) {
        setKategoriList(prev => prev.map(k => 
          k.id === id ? { ...k, nama } : k
        ));
      }
    }
  };

  const handleDeleteKategori = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setKategoriList(prev => prev.filter(k => k.id !== id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Aktif': return 'bg-green-500';
      case 'Selesai': return 'bg-gray-500';
      case 'Akan Datang': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const COLORS = ['#E30613', '#FF5252', '#B40510', '#FF9800', '#4CAF50', '#9C27B0', '#FFC107'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#E30613] to-[#B40510] text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 bg-black/10 border-b border-white/10 text-center">
          <h1 className="text-3xl mb-1">MITU</h1>
          <p className="text-sm opacity-90">Admin Dashboard</p>
          <p className="text-xs opacity-80 mt-2">Telkom University</p>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => { setActivePage('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-white/10 transition-all border-l-4 ${activePage === 'dashboard' ? 'bg-white/20 border-white' : 'border-transparent'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => { setActivePage('users'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-white/10 transition-all border-l-4 ${activePage === 'users' ? 'bg-white/20 border-white' : 'border-transparent'}`}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
          
          <button
            onClick={() => { setActivePage('kategori'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-white/10 transition-all border-l-4 ${activePage === 'kategori' ? 'bg-white/20 border-white' : 'border-transparent'}`}
          >
            <Grid size={20} />
            <span>Kategori</span>
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navbar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} className="text-[#E30613]" />
            </button>
            <h2 className="text-2xl text-[#E30613]">
              {activePage === 'dashboard' && 'Dashboard Kegiatan Kampus'}
              {activePage === 'users' && 'Manajemen Users'}
              {activePage === 'kategori' && 'Manajemen Kategori'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Admin</span>
            <UserCircle size={28} className="text-[#E30613]" />
          </div>
        </div>

        <div className="p-6">
          {/* Dashboard Page */}
          {activePage === 'dashboard' && (
            <div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#E30613]">
                  <p className="text-gray-600 mb-2">Total Kegiatan</p>
                  <p className="text-4xl text-gray-800">{totalKegiatan}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#E30613]">
                  <p className="text-gray-600 mb-2">Kegiatan Aktif</p>
                  <p className="text-4xl text-gray-800">{kegiatanAktif}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#E30613]">
                  <p className="text-gray-600 mb-2">Akan Datang</p>
                  <p className="text-4xl text-gray-800">{kegiatanAkanDatang}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#E30613]">
                  <p className="text-gray-600 mb-2">Selesai</p>
                  <p className="text-4xl text-gray-800">{kegiatanSelesai}</p>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl text-[#E30613] mb-4 pb-3 border-b-2 border-[#E30613] flex items-center gap-2">
                  <Plus size={24} />
                  {editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Nama Kegiatan *</label>
                      <input
                        type="text"
                        name="namaKegiatan"
                        value={formData.namaKegiatan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Kategori *</label>
                      <select
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {kategoriList.map(kat => (
                          <option key={kat.id} value={kat.nama}>{kat.nama}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Tanggal Mulai *</label>
                      <input
                        type="date"
                        name="tanggalMulai"
                        value={formData.tanggalMulai}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Tanggal Akhir *</label>
                      <input
                        type="date"
                        name="tanggalAkhir"
                        value={formData.tanggalAkhir}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Lokasi *</label>
                      <input
                        type="text"
                        name="lokasi"
                        value={formData.lokasi}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Penyelenggara *</label>
                      <input
                        type="text"
                        name="penyelenggara"
                        value={formData.penyelenggara}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Tingkat Kegiatan *</label>
                      <select
                        name="tingkatKegiatan"
                        value={formData.tingkatKegiatan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Tingkat</option>
                        <option value="Jurusan">Jurusan</option>
                        <option value="Fakultas">Fakultas</option>
                        <option value="Universitas">Universitas</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Internasional</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Status *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Status</option>
                        <option value="Akan Datang">Akan Datang</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end mt-6">
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                      >
                        <X size={18} />
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B40510] transition-all hover:shadow-lg flex items-center gap-2"
                    >
                      {editingId ? <Save size={18} /> : <Plus size={18} />}
                      {editingId ? 'Update Kegiatan' : 'Tambah Kegiatan'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Table Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-x-auto">
                <h3 className="text-xl text-[#E30613] mb-4 pb-3 border-b-2 border-[#E30613]">
                  Daftar Semua Kegiatan
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#E30613] text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">No</th>
                        <th className="px-4 py-3 text-left">Nama Kegiatan</th>
                        <th className="px-4 py-3 text-left">Kategori</th>
                        <th className="px-4 py-3 text-left">Tanggal Mulai</th>
                        <th className="px-4 py-3 text-left">Tanggal Akhir</th>
                        <th className="px-4 py-3 text-left">Lokasi</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Penyelenggara</th>
                        <th className="px-4 py-3 text-left">Tingkat</th>
                        <th className="px-4 py-3 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kegiatan.map((k, index) => (
                        <tr key={k.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">{k.namaKegiatan}</td>
                          <td className="px-4 py-3">{k.kategori}</td>
                          <td className="px-4 py-3">{formatDate(k.tanggalMulai)}</td>
                          <td className="px-4 py-3">{formatDate(k.tanggalAkhir)}</td>
                          <td className="px-4 py-3">{k.lokasi}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusBadgeColor(k.status)}`}>
                              {k.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{k.penyelenggara}</td>
                          <td className="px-4 py-3">{k.tingkatKegiatan}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(k.id)}
                                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(k.id)}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {kegiatan.length === 0 && (
                        <tr>
                          <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                            Belum ada data kegiatan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl text-[#E30613] mb-4 pb-3 border-b-2 border-[#E30613]">
                    Kegiatan per Bulan
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getMonthlyData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bulan" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="jumlah" fill="#E30613" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl text-[#E30613] mb-4 pb-3 border-b-2 border-[#E30613]">
                    Distribusi Kategori
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getCategoryData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getCategoryData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Users Page */}
          {activePage === 'users' && (
            <div>
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleAddUser}
                  className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B40510] transition-all hover:shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} />
                  Tambah User
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {users.map(user => (
                  <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E30613] to-[#FF5252] flex items-center justify-center text-white text-3xl mb-4">
                        {user.nama.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="text-lg mb-1">{user.nama}</h4>
                      <p className="text-gray-600 text-sm mb-1">{user.role}</p>
                      <p className="text-gray-500 text-xs mb-4">{user.email}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kategori Page */}
          {activePage === 'kategori' && (
            <div>
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleAddKategori}
                  className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B40510] transition-all hover:shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} />
                  Tambah Kategori
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kategoriList.map(kat => {
                  const jumlahKegiatan = kegiatan.filter(k => k.kategori === kat.nama).length;
                  return (
                    <div key={kat.id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#E30613] hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-full bg-[#E30613] flex items-center justify-center text-white text-2xl">
                          <Grid size={24} />
                        </div>
                      </div>
                      <h4 className="text-xl mb-2">{kat.nama}</h4>
                      <p className="text-gray-600 text-sm mb-4">{kat.deskripsi}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                          {jumlahKegiatan} Kegiatan
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditKategori(kat.id)}
                            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteKategori(kat.id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
