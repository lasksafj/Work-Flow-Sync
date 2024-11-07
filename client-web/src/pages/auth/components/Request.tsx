// components/Profile.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import RequestOff from './RequestOff';
import DropShift from './DropShift';
import SwapShift from './SwapShift';
import '../css/request.css';

const Request: React.FC = () => {
    const [toggle, setToggle] = useState(1);

    function updateToggle(id: number) {
        setToggle(id);
    }

    return (
        <>
            <div className='container1'>
                <div className='bloc-tab'>
                    <button className='tabs' onClick={() => updateToggle(1)}>Request Off</button>
                    <button className='tabs' onClick={() => updateToggle(2)}>Swap Shift</button>
                    <button className='tabs' onClick={() => updateToggle(3)}>Drop Shift</button>
                </div>
                <div className={toggle === 1 ? 'show-content' : 'content'}><RequestOff /></div>
                <div className={toggle === 2 ? 'show-content' : 'content'}><SwapShift /></div>
                <div className={toggle === 3 ? 'show-content' : 'content'}><DropShift /></div>
            </div>
        </>
    )
};

export default Request;