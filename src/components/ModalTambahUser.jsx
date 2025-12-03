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
            ...(name === "Role" && value === "Admin" ? { NIM: "", NIP: "" } : {}),
        }));
    };

    const handleSubmit = () => {
        const dataToSend = {
            ...formData,
            NIM: formData.Role === "Mahasiswa" ? formData.NIM : "",
            NIP: formData.Role === "Dosen" ? formData.NIP : "",
        };

        handleAdd(dataToSend);

        // Reset form
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

                            {formData.Role === "Dosen" && (
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
                <Button variant="primary" onClick={handleSubmit}>Tambah</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalTambahUser;
