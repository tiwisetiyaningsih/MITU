import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { formatDate } from './kegiatanUtils'; // Asumsi Anda memindahkan formatDate ke file utilitas

// ======================================
// FUNGSI UTILITY (Pastikan ini sesuai dengan yang ada di Kegiatan.jsx)
// ======================================
// Jika Anda tidak memindahkan formatDate, letakkan di sini atau import:
const formatDateDisplay = (dateString) => {
    if (!dateString) return "-";
    // Mengambil tanggal saja (YYYY-MM-DD) jika ada format waktu Z
    const date = new Date(dateString.split('T')[0]); 
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
};

const getKategoriBadgeClass = (kategori) => {
    switch (kategori) {
        case "Seminar": return "bg-primary";
        case "Webinar": return "bg-info text-dark";
        case "Pelatihan": return "bg-success";
        case "Kompetisi": return "bg-warning text-dark";
        case "Organisasi": return "bg-danger";
        case "Workshop": return "bg-secondary";
        default: return "bg-light text-dark";
    }
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case "Berlangsung": return "bg-success";
        case "Akan Datang": return "bg-info text-dark";
        case "Selesai": return "bg-secondary";
        default: return "bg-light text-dark";
    }
};

// ======================================
// KOMPONEN MODAL DETAIL KEGIATAN
// ======================================
function DetailKegiatanModal({ show, handleClose, data }) {
    if (!data) return null;

    // Menangani data yang mungkin berbeda-beda formatnya dari API
    const imageSource = data.ImageKegiatan ? `/assets/images/kegiatan/${data.ImageKegiatan}` : '/placeholder.jpg';
    
    // Memformat deskripsi agar baris baru (\n) di-render di HTML
    const formattedDeskripsi = data.DeskripsiKegiatan 
        ? data.DeskripsiKegiatan.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
          ))
        : 'Tidak ada deskripsi.';

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            size="lg" // Ukuran besar agar detail lebih nyaman dibaca
            centered
        >
            <Modal.Header closeButton className="border-0">
                <Modal.Title>Detail Kegiatan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column flex-md-row">
                    {/* Kolom Kiri: Gambar */}
                    <div className="col-md-5 mb-3 mb-md-0">
                        <img 
                            src={imageSource} 
                            alt={data.NamaKegiatan} 
                            style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg' }}
                        />
                    </div>

                    {/* Kolom Kanan: Detail Teks */}
                    <div className="col-md-7 ps-md-4">
                        <h3 className="fw-bold mb-1">{data.NamaKegiatan}</h3>
                        
                        <div className="mb-3">
                            <Badge className={`me-2 ${getKategoriBadgeClass(data.KategoriKegiatan)}`}>
                                {data.KategoriKegiatan}
                            </Badge>
                            <Badge className={getStatusBadgeClass(data.StatusKegiatan)}>
                                Status: {data.StatusKegiatan}
                            </Badge>
                        </div>
                        
                        {/* Informasi Waktu & Tempat */}
                        <p className="mb-2">
                            <i className="bi bi-calendar-fill me-2 text-danger"></i>
                            <span className="fw-semibold">Tanggal:</span> {formatDateDisplay(data.TglMulaiKegiatan)} - {formatDateDisplay(data.TglAkhirKegiatan)}
                        </p>
                        <p className="mb-2">
                            <i className="bi bi-clock-fill me-2 text-danger"></i>
                            <span className="fw-semibold">Waktu:</span> {data.WaktuKegiatan || 'Tidak Tersedia'}
                        </p>
                        <p className="mb-3">
                            <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                            <span className="fw-semibold">Tempat:</span> {data.TempatKegiatan}
                        </p>
                        
                        <hr />

                        {/* Detail Tambahan */}
                        <div className="detail-section">
                            <h5 className="fw-semibold text-muted">Deskripsi</h5>
                            <p className="text-secondary small">{formattedDeskripsi}</p>
                            
                            <h5 className="fw-semibold text-muted mt-3">Penyelenggara</h5>
                            <p className="text-secondary">{data.PenyelenggaraKegiatan || 'Tidak Diketahui'}</p>
                            
                            <h5 className="fw-semibold text-muted mt-3">Tingkat</h5>
                            <p className="text-secondary">{data.TingkatKegiatan || 'Lokal'}</p>
                        </div>
                        
                        {/* Link Pendaftaran */}
                        {data.LinkPendaftaran && (
                            <div className="d-grid mt-4">
                                <a 
                                    href={data.LinkPendaftaran} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-danger btn-lg"
                                >
                                    <i className="bi bi-link-45deg me-2"></i> Buka Link Pendaftaran
                                </a>
                            </div>
                        )}

                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="outline-secondary" onClick={handleClose}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DetailKegiatanModal;