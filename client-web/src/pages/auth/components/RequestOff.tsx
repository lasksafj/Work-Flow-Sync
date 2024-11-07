import { useState } from 'react';
import '../css/request.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';

const requestOffData = [
    {
        requestType: 'off',
        employeeName: 'Phong Truong',
        startDate: '2024-11-06T09:00:00',
        endDate: '2024-11-06T22:00:00',
        reason: "Personal issue",
        requestDate: '2024-11-06T08:00:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Emily Nguyen',
        startDate: '2024-11-07T10:00:00',
        endDate: '2024-11-07T18:00:00',
        reason: "Family event",
        requestDate: '2024-11-05T12:00:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Long Dao',
        startDate: '2024-11-08T08:00:00',
        endDate: '2024-11-08T16:00:00',
        reason: "Medical appointment",
        requestDate: '2024-11-06T09:30:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Sarah Lee',
        startDate: '2024-11-09T12:00:00',
        endDate: '2024-11-09T20:00:00',
        reason: "Vacation",
        requestDate: '2024-11-04T11:15:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Michael Brown',
        startDate: '2024-11-10T14:00:00',
        endDate: '2024-11-10T22:00:00',
        reason: "Childcare",
        requestDate: '2024-11-07T13:00:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Jessica Tran',
        startDate: '2024-11-11T07:00:00',
        endDate: '2024-11-11T15:00:00',
        reason: "Personal business",
        requestDate: '2024-11-09T14:45:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'David Kim',
        startDate: '2024-11-12T09:00:00',
        endDate: '2024-11-12T17:00:00',
        reason: "Wedding",
        requestDate: '2024-11-05T10:00:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Lisa White',
        startDate: '2024-11-13T11:00:00',
        endDate: '2024-11-13T19:00:00',
        reason: "Family reunion",
        requestDate: '2024-11-08T09:15:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Tommy Huang',
        startDate: '2024-11-14T15:00:00',
        endDate: '2024-11-14T23:00:00',
        reason: "Travel",
        requestDate: '2024-11-09T16:00:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Rachel Green',
        startDate: '2024-11-15T08:00:00',
        endDate: '2024-11-15T16:00:00',
        reason: "School event",
        requestDate: '2024-11-10T12:00:00',
        status: 'pending',
    },
    {
        requestType: 'off',
        employeeName: 'Kevin Johnson',
        startDate: '2024-11-16T10:00:00',
        endDate: '2024-11-16T18:00:00',
        reason: "Volunteer work",
        requestDate: '2024-11-12T14:30:00',
        status: 'pending',
    }
];

const RequestOff = () => {
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
                    {requestOffData.map((request, index) => {
                        return (
                            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12 request-item' key={index}>
                                <div className='card'>
                                    <div className='card-header'>
                                        {request.employeeName}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {format(new Date(request.startDate), 'yyyy-MM-dd hh:mm')}</h5>
                                        <h5>To: {format(new Date(request.endDate), 'yyyy-MM-dd HH:mm')}</h5>
                                        <p>Reason: {request.reason}</p>
                                        <h6>Request Date: {format(new Date(request.requestDate), 'yyyy-MM-dd')}</h6>
                                    </div>
                                    <div className="button-container">
                                        <button type="button" className="btn btn-primary" onClick={() => openModal(index)} >Accept</button>
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

export default RequestOff;