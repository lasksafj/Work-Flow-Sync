import React from 'react';
import './Request.css';
import { Modal, Button } from 'react-bootstrap';

// Define the interface for the ConfirmationModal component
interface ConfirmationModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    onConfirm: () => void;
    actionType: string;
};

// ConfirmationModal component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    showModal,
    setShowModal,
    onConfirm,
    actionType
}: ConfirmationModalProps) => {

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>

            {/* Modal Header */}
            <Modal.Header closeButton>
                <Modal.Title>Do you {actionType.toLowerCase()}?</Modal.Title>
            </Modal.Header>

            {/* Modal Body */}
            <Modal.Body>
                <Modal.Title>Remember: After choosing, you cannot change it.</Modal.Title>
            </Modal.Body>

            {/* Modal Footer */}
            <Modal.Footer>
                <Button variant="secondary"
                    onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button
                    variant="success"
                    onClick={() => {
                        onConfirm();
                        setShowModal(false);
                    }}
                >
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmationModal;