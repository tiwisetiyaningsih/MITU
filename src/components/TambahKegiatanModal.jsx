import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
// Pastikan Anda telah menginstal dan mengimport Bootstrap CSS di file utama Anda
// import 'bootstrap/dist/css/bootstrap.min.css';

// Props yang diterima:
// show: boolean (untuk menampilkan/menyembunyikan modal)
// handleClose: function (untuk menutup modal)
// handleSubmit: function (untuk mengirim data form)

function TambahKegiatanModal({ show, handleClose, handleSubmit }) {
    // State untuk data form kegiatan
    const [formData, setFormData] = useState({
        namaKegiatan: '',
        deskripsi: '',
        status: '',
        tanggalMulai: '',
        tanggalAkhir: '',
        tempat: '',
        penyelenggara: '',
        kategori: '',
        tingkat: '',
        imageKegiatan: null, // Untuk menampung File Object
        linkPendaftaran: '',
    });

    // Reset form saat modal dibuka/ditutup
    useEffect(() => {
        if (!show) {
            setFormData({
                namaKegiatan: '',
                deskripsi: '',
                status: '',
                tanggalMulai: '',
                tanggalAkhir: '',
                tempat: '',
                penyelenggara: '',
                kategori: '',
                tingkat: '',
                imageKegiatan: null,
                linkPendaftaran: '',
            });
        }
    }, [show]);

    // Handler untuk input teks dan select
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler untuk input file (Image)
    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, imageKegiatan: e.target.files[0] }));
    };

    // Handler saat form disubmit
    const onSubmit = (e) => {
        e.preventDefault();
        
        // Cek validasi minimal di sini (opsional)
        if (!formData.namaKegiatan || !formData.tanggalMulai || !formData.status) {
            alert("Harap lengkapi Nama Kegiatan, Tanggal Mulai, dan Status.");
            return;
        }

        // Panggil fungsi handleSubmit dari parent dengan data terbaru
        handleSubmit(formData);
        handleClose(); // Tutup modal setelah submit
    };

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            size="lg" // Ukuran modal besar agar form tidak terlalu sempit
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title style={{ fontWeight: 'bold' }}>Tambah Kegiatan Baru</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <p className="text-muted mb-4">
                        Masukkan informasi kegiatan baru di bawah ini.
                    </p>

                    {/* BARIS 1: Nama Kegiatan & Deskripsi (diubah menjadi textarea) */}
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Kegiatan</Form.Label>
                        <Form.Control
                            type="text"
                            name="namaKegiatan"
                            placeholder="Masukkan nama kegiatan"
                            value={formData.namaKegiatan}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Deskripsi Kegiatan</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="deskripsi"
                            placeholder="Masukkan deskripsi kegiatan"
                            rows={3}
                            value={formData.deskripsi}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        {/* Status Kegiatan */}
                        <Form.Group as={Col} controlId="formStatus">
                            <Form.Label>Status Kegiatan</Form.Label>
                            <Form.Select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange}
                                required
                            >
                                <option value="">Pilih Status</option>
                                <option value="Akan Datang">Akan Datang</option>
                                <option value="Berlangsung">Berlangsung</option>
                                <option value="Selesai">Selesai</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Kategori Kegiatan */}
                        <Form.Group as={Col} controlId="formKategori">
                            <Form.Label>Kategori Kegiatan</Form.Label>
                            <Form.Select 
                                name="kategori" 
                                value={formData.kategori} 
                                onChange={handleChange}
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Pelatihan">Pelatihan</option>
                                <option value="Kompetisi">Kompetisi</option>
                                {/* Tambahkan kategori lain sesuai kebutuhan */}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                        {/* Tanggal Mulai Kegiatan */}
                        <Form.Group as={Col} controlId="formTglMulai">
                            <Form.Label>Tanggal Mulai Kegiatan</Form.Label>
                            <Form.Control
                                type="date"
                                name="tanggalMulai"
                                value={formData.tanggalMulai}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Tanggal Akhir Kegiatan */}
                        <Form.Group as={Col} controlId="formTglAkhir">
                            <Form.Label>Tanggal Akhir Kegiatan</Form.Label>
                            <Form.Control
                                type="date"
                                name="tanggalAkhir"
                                value={formData.tanggalAkhir}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                        {/* Tempat Kegiatan */}
                        <Form.Group as={Col} controlId="formTempat">
                            <Form.Label>Tempat Kegiatan</Form.Label>
                            <Form.Control
                                type="text"
                                name="tempat"
                                placeholder="Masukkan lokasi/link daring"
                                value={formData.tempat}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        {/* Penyelenggara Kegiatan */}
                        <Form.Group as={Col} controlId="formPenyelenggara">
                            <Form.Label>Penyelenggara Kegiatan</Form.Label>
                            <Form.Control
                                type="text"
                                name="penyelenggara"
                                placeholder="Cth: HIMA IF, UKM Tari"
                                value={formData.penyelenggara}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                        {/* Tingkat Kegiatan */}
                        <Form.Group as={Col} controlId="formTingkat">
                            <Form.Label>Tingkat Kegiatan</Form.Label>
                            <Form.Select 
                                name="tingkat" 
                                value={formData.tingkat} 
                                onChange={handleChange}
                            >
                                <option value="">Pilih Tingkat</option>
                                <option value="Internal">Internal (Kampus)</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">Internasional</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Link Pendaftaran */}
                        <Form.Group as={Col} controlId="formLink">
                            <Form.Label>Link Pendaftaran</Form.Label>
                            <Form.Control
                                type="url"
                                name="linkPendaftaran"
                                placeholder="https://..."
                                value={formData.linkPendaftaran}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>
                    
                    {/* Image Kegiatan */}
                    <Form.Group controlId="formImage" className="mb-3">
                        <Form.Label>Image Kegiatan (Poster)</Form.Label>
                        <Form.Control
                            type="file"
                            name="imageKegiatan"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {formData.imageKegiatan && (
                            <Form.Text className="text-muted">
                                File dipilih: {formData.imageKegiatan.name}
                            </Form.Text>
                        )}
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="light" 
                        onClick={handleClose} 
                        style={{ color: '#212529', border: '1px solid #dee2e6' }}
                    >
                        Batal
                    </Button>
                    <Button 
                        variant="danger" 
                        type="submit"
                        style={{ backgroundColor: '#d90000', borderColor: '#d90000' }}
                    >
                        Simpan
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default TambahKegiatanModal;