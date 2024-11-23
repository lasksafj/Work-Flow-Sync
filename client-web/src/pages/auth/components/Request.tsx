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

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/api/request/get-org`);
                setAllOrgs(res.data);
            } catch (error) {
                alert(error);
            } finally {
                setIsLoading(false);
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
                {isLoading ? (
                    <div className="loader" aria-live="polite">
                        Loading workplaces...
                    </div>
                ) : (
                    <select
                        className="form-select custom-select"
                        aria-label="Select a workplace"
                        onChange={onChange}
                    >
                        <option value='' disabled selected>
                            Select a workplace
                        </option>
                        {allOrgs.map((org, index) => (
                            <option key={index} value={index}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                )}

                <div className="bloc-tab">
                    <button
                        className={`tabs ${toggle === 1 ? 'active' : ''}`}
                        onClick={() => updateToggle(1)}
                        role="tab"
                        aria-selected={toggle === 1}
                    >
                        <span className="tab-icon">🔄</span> Swap Shifts
                    </button>
                    <button
                        className={`tabs ${toggle === 2 ? 'active' : ''}`}
                        onClick={() => updateToggle(2)}
                        role="tab"
                        aria-selected={toggle === 2}
                    >
                        <span className="tab-icon">❌</span> Drop Shifts
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