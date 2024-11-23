import { useEffect, useState } from 'react';
import '../css/request.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';
import api from '../../../apis/api';

interface DropShiftProps {
    abbreviation: string;
}

const DropShift: React.FC<DropShiftProps> = ({ abbreviation }) => {
    const [dropShiftsData, setDropShiftsData] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [actionType, setActionType] = useState<string>('');

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm');
    }

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

    const openModal = (index: number, action: string) => {
        setSelectedRequest(index);
        setActionType(action);
        setShowModal(true);
    }

    const handleAction = async () => {
        if (selectedRequest === null) return;

        const requestId = dropShiftsData[selectedRequest].id;
        const scheduleId = dropShiftsData[selectedRequest].schedules_id;

        try {
            // Call the appropriate API endpoint
            await api.put('/api/request/update-dropshifts',
                { requestId, dropStatus: actionType, scheduleId });

            // Update the UI by removing the processed request
            setDropShiftsData(prevData =>
                prevData.filter((_, index) => index !== selectedRequest)
            );

            alert(`Request ${actionType}ed successfully!`);
        } catch (error: any) {
            alert(`Failed to ${actionType.toLowerCase()} request: ${error.message}`);
        } finally {
            setShowModal(false);
            setSelectedRequest(null);
            setActionType('');
        }
    };

    return (
        <div className='request'>
            <div className='container'>
                <div className='row'>
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
                                        <button type="button" className="btn btn-primary" onClick={() => openModal(index, 'Accept')}>Accept</button>
                                        <button type="button" className="btn btn-primary" onClick={() => openModal(index, 'Deny')}>Deny</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
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