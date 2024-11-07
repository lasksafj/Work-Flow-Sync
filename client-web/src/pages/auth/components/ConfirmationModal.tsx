import React from 'react';
import '../css/request.css';
import { Modal, Button } from 'react-bootstrap';

type ModalProps = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConfirmationModal = ({
    showModal,
    setShowModal,
}: ModalProps) => {
    function dispatch(arg0: any) {
        throw new Error("Function not implemented.");
    }
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Modal.Title>Remember: After choosing, you cannot change it.</Modal.Title>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button
                    variant="success"
                    onClick={() => alert('You chose it!')}
                >
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmationModal;