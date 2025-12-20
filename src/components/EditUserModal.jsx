import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function EditUserModal({ show, handleClose, editStatusAkun, initialData }) {
    const [formData, setFormData] = useState({
        Nama: "",
        Username: "",
        Email: "",
        Role: "",
        NIM: "",
        NIP: "",
        StatusAkun: "",
        Password: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                Nama: initialData.Nama,
                Username: initialData.Username || "",
                Email: initialData.Email,
                Role: initialData.Role,
                NIM: initialData.NIM || "",
                NIP: initialData.NIP || "",
                StatusAkun: initialData.StatusAkun,
                Password: ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        editStatusAkun(initialData.UserID, formData);
    };

    const isReadonly = true;

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Username"
                                    value={formData.Username}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nama</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nama"
                                    value={formData.Nama}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Role"
                                    value={formData.Role}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* NIM / NIP */}
                    <Row>
                        {formData.Role === "Mahasiswa" && (
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>NIM</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="NIM"
                                        value={formData.NIM}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        )}

                        {(formData.Role === "Dosen" || formData.Role === "Admin") && (
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>NIP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="NIP"
                                        value={formData.NIP}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        )}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status Akun</Form.Label>
                                <Form.Select
                                    name="StatusAkun"
                                    value={formData.StatusAkun}
                                    onChange={handleChange}
                                >
                                    <option>Aktif</option>
                                    <option>Nonaktif</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Tutup
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Simpan Perubahan
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditUserModal;
