import { useEffect, useState } from 'react';
import '../css/request.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';
import api from '../../../apis/api';

interface SwapShiftProps {
    abbreviation: string;
}

const SwapShift: React.FC<SwapShiftProps> = ({ abbreviation }) => {
    const [swapShiftsData, setSwapShiftsData] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm');
    }

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

    const openModal = (index: number) => {
        setSelectedRequest(index);
        setShowModal(true);
    }

    return (
        <div className='request'>
            <div className='container'>
                <div className='row'>
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
                                        <button type="button" className="btn btn-primary" onClick={() => openModal(index)}>Accept</button>
                                        <button type="button" className="btn btn-primary" onClick={() => openModal(index)}>Deny</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <ConfirmationModal showModal={showModal} setShowModal={setShowModal} />
        </div>
    )
}

export default SwapShift;