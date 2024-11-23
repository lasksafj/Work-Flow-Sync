// components/Profile.tsx
import React, { useEffect, useState } from 'react';
import DropShift from './DropShift';
import SwapShift from './SwapShift';
import '../css/request.css';
import api from '../../../apis/api';

interface AllOrgsProps {
    abbreviation: string,
    name: string,
}

const Request: React.FC = () => {
    const [allOrgs, setAllOrgs] = useState<AllOrgsProps[]>([]);
    const [toggle, setToggle] = useState(1);
    const [abbreviation, setAbbreviation] = useState('');

    function updateToggle(id: number) {
        setToggle(id);
    }

    const renderTabContent = () => {
        switch (toggle) {
            case 1: return <SwapShift abbreviation={abbreviation} />;
            case 2: return <DropShift abbreviation={abbreviation} />;
            default: return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/api/request/get-org`);
                const data = res.data;

                setAllOrgs(data);
            } catch (error) {
                alert(error);
            }
        };

        fetchData();
    }, []);

    const onChange = (event: any) => {
        const selectedIndex = event.target.value;
        const selected = allOrgs[selectedIndex].abbreviation;
        setAbbreviation(selected);

    };

    return (
        <>
            <div className='container1'>
                <div>Workplace Name</div>
                <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={onChange}
                >
                    <option value='' selected disabled>Please choose the work place</option>
                    {allOrgs.map((org, index) => {
                        return (
                            <option value={index}>{org.name} </option>
                        )
                    })}
                </select>
                <div className='bloc-tab'>
                    <button
                        className={`tabs ${toggle === 1 ? 'active' : ''}`}
                        onClick={() => updateToggle(1)}
                        role='tab'
                        aria-selected={toggle === 1}
                    >
                        Swap Shifts
                    </button>
                    <button
                        className={`tabs ${toggle === 2 ? 'active' : ''}`}
                        onClick={() => updateToggle(2)}
                        role='tab'
                        aria-selected={toggle === 2}
                    >
                        Drop Shifts
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