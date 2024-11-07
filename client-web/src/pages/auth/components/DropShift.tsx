import { useState } from 'react';
import '../css/request.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';

const dropShift = [
    {
        requestType: 'drop',
        shiftId: 2,
        employeeName: 'Long Dao',
        shiftStart: '2024-11-06T10:30:00',
        shiftEnd: '2024-11-06T15:30:00',
        reason: "Personal",
        requestDate: '2024-11-06T09:00:00',
        status: 'pending'
    },
];

const DropShift = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

    const openModal = (index: number) => {
        setSelectedRequest(index);
        setShowModal(true);
    }

    return (
        <div className='request'>
            <div className='container'>
                <div className='row'>
                    {dropShift.map((request, index) => {
                        return (
                            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12 request-item' key={index}>
                                <div className='card'>
                                    <div className='card-header'>
                                        {request.employeeName}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {format(new Date(request.shiftStart), 'yyyy-MM-dd hh:mm')}</h5>
                                        <h5>To: {format(new Date(request.shiftEnd), 'yyyy-MM-dd hh:mm')}</h5>
                                        <p>Reason: {request.reason}</p>
                                        <h5>To: {format(new Date(request.shiftEnd), 'yyyy-MM-dd')}</h5>
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

export default DropShift;