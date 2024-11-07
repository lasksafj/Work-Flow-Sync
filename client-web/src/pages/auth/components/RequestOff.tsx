import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/request.css';

const requestOff = [
    {
        requestType: 'off',
        employeeName: 'Phong Truong',
        startDate: '2024-11-06 09:00',
        endDate: '2024-11-06 22:00',
        reason: "Personal issue",
        requestDate: '2024-11-06',
        status: 'pending',
    },
];

const RequestOff = () => {
    return (
        <div className='request'>
            <div className='container'>
                <div className='row'>
                    {requestOff.map((request, index) => {
                        return (
                            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12 request-item' key={index}>
                                <div className='card'>
                                    <div className='card-header'>
                                        {request.employeeName}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {request.startDate}</h5>
                                        <h5>To: {request.endDate}</h5>
                                        <p>Reason: {request.reason}</p>
                                        <button type="button" className="btn btn-primary btn-sm" >Accept</button>
                                        <button type="button" className="btn btn-primary btn-sm">Deny</button>
                                        <h6>Request Date: {request.requestDate}</h6>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )
}

export default RequestOff;