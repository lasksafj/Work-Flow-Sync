import { useEffect, useState } from 'react';
import './Request.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';
import api from '../../../apis/api';

// Define the interface for the SwapShift component
interface SwapShiftProps {
    abbreviation: string;
}

// SwapShift component
const SwapShift: React.FC<SwapShiftProps> = ({ abbreviation }) => {
    const [swapShiftsData, setSwapShiftsData] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [actionType, setActionType] = useState<string>('');


    // Format a date string
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm');
    }

    // Fetch swap shift requests whenever the `abbreviation` changes
    useEffect(() => {
        let org = abbreviation;

        const fetchData = async () => {
            try {
                const res = await api.get(`/api/request/get-swapshifts?org=${org}`);
                const data = res.data;

                setSwapShiftsData(data);
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

        const requestId = swapShiftsData[selectedRequest].id;
        const scheduleId1 = swapShiftsData[selectedRequest].scheduleid1;
        const scheduleId2 = swapShiftsData[selectedRequest].scheduleid2;
        const empid1 = swapShiftsData[selectedRequest].empid1;
        const empid2 = swapShiftsData[selectedRequest].empid2;

        try {
            // Call the API to update the drop shift request status
            await api.put('/api/request/update-swapshifts',
                { requestId, swapStatus: actionType, scheduleId1, scheduleId2, empid1, empid2 });

            // Remove the processed request from the UI
            setSwapShiftsData(prevData =>
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

    // Render the SwapShift component
    return (
        <div className='request'>
            <div className='container'>
                <div className='row'>

                    {/* Render each swap shift request as a card */}
                    {swapShiftsData.map((request, index) => {
                        return (
                            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12 request-item' key={index}>
                                <div className='card'>
                                    <div className='card-header'>
                                        {request.fullname1}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {formatDate(request.start_time)}</h5>
                                        <h5>To: {formatDate(request.end_time)}</h5>
                                    </div>
                                    <div className='card-header'>
                                        Swap with: {request.fullname2}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {formatDate(request.starttime)}</h5>
                                        <h5>To: {formatDate(request.endtime)}</h5>
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

export default SwapShift;