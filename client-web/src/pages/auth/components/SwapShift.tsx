import { useState } from 'react';
import '../css/request.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';

const swapShift = [
    {
        requestType: 'swap',
        shiftId: 1,
        employeeName: 'Quy Tran',
        shiftStart: '2024-11-06T09:30:00',
        shiftEnd: '2024-11-06T14:30:00',
        shiftSwapId: 5,
        whoSwap: 'Nhat Nguyen',
        shiftSwapStart: '2024-11-07T12:00:00',
        shiftSwapEnd: '2024-11-07T20:00:00',
        reason: "Sickness",
        requestDate: '2024-11-06T09:00:00',
        status: 'pending'
    },
    {
        requestType: 'swap',
        shiftId: 2,
        employeeName: 'Emily Nguyen',
        shiftStart: '2024-11-08T10:00:00',
        shiftEnd: '2024-11-08T18:00:00',
        shiftSwapId: 7,
        whoSwap: 'Anh Tran',
        shiftSwapStart: '2024-11-09T08:00:00',
        shiftSwapEnd: '2024-11-09T16:00:00',
        reason: "Family event",
        requestDate: '2024-11-07T10:30:00',
        status: 'pending'
    },
    {
        requestType: 'swap',
        shiftId: 3,
        employeeName: 'Michael Brown',
        shiftStart: '2024-11-10T14:00:00',
        shiftEnd: '2024-11-10T22:00:00',
        shiftSwapId: 8,
        whoSwap: 'Lisa White',
        shiftSwapStart: '2024-11-12T07:00:00',
        shiftSwapEnd: '2024-11-12T15:00:00',
        reason: "Childcare",
        requestDate: '2024-11-09T11:45:00',
        status: 'pending'
    },
    {
        requestType: 'swap',
        shiftId: 4,
        employeeName: 'Sarah Lee',
        shiftStart: '2024-11-14T12:00:00',
        shiftEnd: '2024-11-14T20:00:00',
        shiftSwapId: 10,
        whoSwap: 'David Kim',
        shiftSwapStart: '2024-11-15T10:00:00',
        shiftSwapEnd: '2024-11-15T18:00:00',
        reason: "Personal issue",
        requestDate: '2024-11-13T09:15:00',
        status: 'pending'
    },
    {
        requestType: 'swap',
        shiftId: 5,
        employeeName: 'Jessica Tran',
        shiftStart: '2024-11-16T09:00:00',
        shiftEnd: '2024-11-16T17:00:00',
        shiftSwapId: 12,
        whoSwap: 'Tommy Huang',
        shiftSwapStart: '2024-11-17T15:00:00',
        shiftSwapEnd: '2024-11-17T23:00:00',
        reason: "Unexpected travel",
        requestDate: '2024-11-14T12:30:00',
        status: 'pending'
    },
];

const SwapShift = () => {
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
                    {swapShift.map((request, index) => {
                        return (
                            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12 request-item' key={index}>
                                <div className='card'>
                                    <div className='card-header'>
                                        {request.employeeName}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {format(new Date(request.shiftStart), 'yyyy-MM-dd HH:mm')}</h5>
                                        <h5>To: {format(new Date(request.shiftEnd), 'yyyy-MM-dd HH:mm')}</h5>
                                    </div>
                                    <div className='card-header'>
                                        Swap with {request.whoSwap}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {format(new Date(request.shiftSwapStart), 'yyyy-MM-dd HH:mm')}</h5>
                                        <h5>To: {format(new Date(request.shiftSwapEnd), 'yyyy-MM-dd HH:mm')}</h5>
                                        <p>Reason: {request.reason}</p>
                                        <h6>Request Date: {format(new Date(request.requestDate), 'yyyy-MM-dd')}</h6>
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