import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function ModalTambahUser({ show, handleClose, handleAdd }) {
    const [formData, setFormData] = useState({
        Username: "",
        Nama: "",
        Email: "",
        Password: "",
        Role: "",
        NIM: "",
        NIP: "",
        StatusAkun: "Aktif",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "Role" && value === "Mahasiswa" ? { NIP: "" } : {}),
            ...(name === "Role" && value === "Dosen" ? { NIM: "" } : {}),
            ...(name === "Role" && value === "Admin" ? { NIM: "" } : {}),
        }));
    };

    const isEmailValid = (email, role) => {
        if (role === "Mahasiswa") {
            return email.endsWith("@student.telkomuniversity.ac.id");
        }

        if (role === "Dosen" || role === "Admin") {
            return email.endsWith("@telkomuniversity.ac.id");
        }

        return false;
    };

    const validateForm = () => {
        if (!formData.Username.trim()) return "Username wajib diisi";
        if (!formData.Nama.trim()) return "Nama wajib diisi";
        if (!formData.Email.trim()) return "Email wajib diisi";
        if (!formData.Password.trim()) return "Password wajib diisi";
        if (!formData.Role) return "Role wajib dipilih";

        if (!isEmailValid(formData.Email.trim(), formData.Role)) {
            return "Format email tidak diterima";
        }

        if (formData.Role === "Mahasiswa" && !formData.NIM.trim()) {
            return "NIM wajib diisi untuk Mahasiswa";
        }

        if (
            (formData.Role === "Dosen" || formData.Role === "Admin") &&
            !formData.NIP.trim()
        ) {
            return "NIP wajib diisi untuk Dosen/Admin";
        }

        return null; // valid
    };

    const tambahUser = () => {
        const errorMessage = validateForm();

        if (errorMessage) {
            alert(errorMessage);
            return; // STOP submit
        }

        const dataToSend = {
            nama: formData.Nama.trim(),
            email: formData.Email.trim(),
            username: formData.Username.trim(),
            password: formData.Password,
            NIM: formData.Role === "Mahasiswa" ? formData.NIM.trim() : null,
            NIP:
                formData.Role === "Dosen" || formData.Role === "Admin"
                    ? formData.NIP.trim()
                    : null,
        };

        handleAdd(dataToSend);

        setFormData({
            Username: "",
            Nama: "",
            Email: "",
            Password: "",
            Role: "",
            NIM: "",
            NIP: "",
            StatusAkun: "Aktif",
        });

        handleClose();
    };


    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Tambah Pengguna</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row>
                        {/* KIRI */}
                        <Col md={6}>
                            {/* USERNAME */}
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Username"
                                    value={formData.Username}
                                    onChange={handleChange}
                                    placeholder="Masukkan Username"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nama</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nama"
                                    value={formData.Nama}
                                    onChange={handleChange}
                                    placeholder="Masukkan Nama"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    placeholder="Masukkan Email"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    placeholder="Masukkan Password"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* KANAN */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                    name="Role"
                                    value={formData.Role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Pilih Role --</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Dosen">Dosen</option>
                                    <option value="Mahasiswa">Mahasiswa</option>
                                </Form.Select>
                            </Form.Group>

                            {formData.Role === "Mahasiswa" && (
                                <Form.Group className="mb-3">
                                    <Form.Label>NIM</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="NIM"
                                        value={formData.NIM}
                                        onChange={handleChange}
                                        placeholder="Masukkan NIM"
                                    />
                                </Form.Group>
                            )}

                            {formData.Role === "Dosen" || formData.Role === "Admin" && (
                                <Form.Group className="mb-3">
                                    <Form.Label>NIP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="NIP"
                                        value={formData.NIP}
                                        onChange={handleChange}
                                        placeholder="Masukkan NIP"
                                    />
                                </Form.Group>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label>Status Akun</Form.Label>
                                <Form.Select
                                    name="StatusAkun"
                                    value={formData.StatusAkun}
                                    onChange={handleChange}
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Nonaktif">Nonaktif</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Batal</Button>
                <Button variant="primary" onClick={tambahUser}>Tambah</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalTambahUser;
