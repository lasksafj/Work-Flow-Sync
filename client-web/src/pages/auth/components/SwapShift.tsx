import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/request.css';

const swapShift = [
    {
        requestType: 'swap',
        shiftId: 1,
        employeeName: 'Quy Tran',
        shiftStart: '2024-11-06 09:30',
        shiftEnd: '2024-11-06 14:30',
        shiftSwapId: 5,
        whoSwap: 'Phong Truong',
        shiftSwapStart: '2024-11-07 12:00',
        shiftSwapEnd: '2024-11-07 20:00',
        reason: "Sickness",
        requestDate: '2024-11-06',
        status: 'pending'
    },
];

const SwapShift = () => {
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
                                        <h5>From: {request.shiftStart}</h5>
                                        <h5>To: {request.shiftEnd}</h5>
                                    </div>
                                    <div className='card-header'>
                                        Swap with {request.whoSwap}
                                    </div>
                                    <div className='card-body'>
                                        <h5>From: {request.shiftSwapStart}</h5>
                                        <h5>To: {request.shiftSwapEnd}</h5>
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

export default SwapShift;