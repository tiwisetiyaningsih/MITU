import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditUserModal({ show, handleClose, handleUpdate, initialData }) {
    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.UserID) {
            handleUpdate(formData.UserID, formData);
        } else {
            alert("Error: User ID tidak ditemukan.");
        }
    };

    if (!initialData) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Pengguna: {initialData.Nama}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control type="text" name="Nama" value={formData.Nama || ''} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="Email" value={formData.Email || ''} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select name="Role" value={formData.Role || ''} onChange={handleChange} required>
                            <option value="Mahasiswa">Mahasiswa</option>
                            <option value="Dosen">Dosen</option>
                            <option value="Admin">Admin</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status Akun</Form.Label>
                        <Form.Select name="StatusAkun" value={formData.StatusAkun || ''} onChange={handleChange} required>
                            <option value="Aktif">Aktif</option>
                            <option value="Nonaktif">Nonaktif</option>
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>{formData.Role === 'Mahasiswa' ? 'NIM' : 'NIP'}</Form.Label>
                        <Form.Control 
                            type="text" 
                            name={formData.Role === 'Mahasiswa' ? 'NIM' : 'NIP'} 
                            value={formData.Role === 'Mahasiswa' ? (formData.NIM || '') : (formData.NIP || '')} 
                            onChange={handleChange} 
                            placeholder={`Masukkan ${formData.Role === 'Mahasiswa' ? 'NIM' : 'NIP'}`}
                        />
                    </Form.Group>

                    <div className="d-grid gap-2 mt-4">
                        <Button variant="danger" type="submit">
                            Simpan Perubahan
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditUserModal;