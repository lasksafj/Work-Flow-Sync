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

    const renderTabContent = () => {
        switch (toggle) {
            case 1: return <RequestOff />;
            case 2: return <SwapShift />;
            case 3: return <DropShift />;
            default: return null;
        }
    }

    return (
        <>
            <div className='container1'>
                <div className='bloc-tab'>
                    <button
                        className={`tabs ${toggle === 1 ? 'active' : ''}`}
                        onClick={() => updateToggle(1)}
                        role='tab'
                        aria-selected={toggle === 1}
                    >
                        Request Off
                    </button>
                    <button
                        className={`tabs ${toggle === 2 ? 'active' : ''}`}
                        onClick={() => updateToggle(2)}
                        role='tab'
                        aria-selected={toggle === 2}
                    >
                        Swap Shift
                    </button>
                    <button
                        className={`tabs ${toggle === 3 ? 'active' : ''}`}
                        onClick={() => updateToggle(3)}
                        role='tab'
                        aria-selected={toggle === 3}
                    >
                        Drop Shift
                    </button>
                </div>
                <div className='content-wrapper'>
                    <div className={'content  show-content'}>
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </>
    )
};

export default Request;