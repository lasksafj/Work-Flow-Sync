import { useEffect, useState } from 'react';
import '../css/request.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';
import api from '../../../apis/api';

// Define the interface for the DropShift component
interface DropShiftProps {
    abbreviation: string;
}

// DropShift component
const DropShift: React.FC<DropShiftProps> = ({ abbreviation }) => {
    const [dropShiftsData, setDropShiftsData] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [actionType, setActionType] = useState<string>('');

    // Format a date string
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm');
    }

    // Fetch drop shift requests whenever the `abbreviation` changes
    useEffect(() => {
        let org = abbreviation;

        const fetchData = async () => {
            try {
                const res = await api.get(`/api/request/get-dropshifts?org=${org}`);
                const data = res.data;

                setDropShiftsData(data);
            } catch (error) {
                alert(error);
            }
        };

        fetchData();
    }, [abbreviation]);

    // Open the confirmation modal
    const openModal = (index: number, action: string) => {
        setSelectedRequest(index);
        setActionType(action);
        setShowModal(true);
    }

    // Handle the action (Accept/Deny) on the selected request
    const handleAction = async () => {
        if (selectedRequest === null) return;

        const requestId = dropShiftsData[selectedRequest].id;
        const scheduleId = dropShiftsData[selectedRequest].schedules_id;

        try {
            // Call the API to update the drop shift request status
            await api.put('/api/request/update-dropshifts',
                { requestId, dropStatus: actionType, scheduleId });

            // Remove the processed request from the UI
            setDropShiftsData(prevData =>
                prevData.filter((_, index) => index !== selectedRequest)
            );

            alert(`Request ${actionType}ed successfully!`);
        } catch (error: any) {
            alert(`Failed to ${actionType.toLowerCase()} request: ${error.message}`);
        } finally {
            // Reset modal-related state
            setShowModal(false);
            setSelectedRequest(null);
            setActionType('');
        }
    };

    // Render the DropShift component
    return (
        <div className='request'>
            <div className='container'>
                <div className='row'>

                    {/* Render each drop shift request as a card */}
                    {dropShiftsData.map((request, index) => {
                        return (
                            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12 request-item' key={index}>
                                <div className='card'>
                                    <div className='card-header'>
                                        {request.fullname}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {formatDate(request.start_time)}</h5>
                                        <h5>To: {formatDate(request.end_time)}</h5>
                                        <p>Reason: {request.reason}</p>
                                        <h6>Request Date: {formatDate(request.request_time)}</h6>
                                    </div>
                                    <div className="button-container">
                                        <button type="button" className="btn btn-primary"
                                            onClick={() => openModal(index, 'Accept')}>Accept</button>
                                        <button type="button" className="btn btn-primary"
                                            onClick={() => openModal(index, 'Deny')}>Deny</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Confirmation modal */}
            <ConfirmationModal
                showModal={showModal}
                setShowModal={setShowModal}
                onConfirm={handleAction}
                actionType={actionType}
            />
        </div>
    )
}

export default DropShift;