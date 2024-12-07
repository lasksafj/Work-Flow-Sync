import React, { useEffect, useState } from 'react';
import DropShift from './DropShift';
import SwapShift from './SwapShift';
import '../css/request.css';
import api from '../../../apis/api';

// Define the interface for organization properties
interface AllOrgsProps {
    abbreviation: string,
    name: string,
}

// Define the Request component
const Request: React.FC = () => {
    const [allOrgs, setAllOrgs] = useState<AllOrgsProps[]>([]);
    const [toggle, setToggle] = useState(1);
    const [abbreviation, setAbbreviation] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Function to update the active tab
    function updateToggle(id: number) {
        setToggle(id);
    }

    // Function to render the content of the active tab
    const renderTabContent = () => {
        switch (toggle) {
            case 1: return <SwapShift abbreviation={abbreviation} />;
            case 2: return <DropShift abbreviation={abbreviation} />;
            default: return null;
        }
    }

    // Fetch organization data from the API
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

    // Function to handle the change in selected workplace
    const onChange = (event: any) => {
        const selectedIndex = event.target.value;
        const selected = allOrgs[selectedIndex].abbreviation;
        setAbbreviation(selected);

    };

    // Render the component
    return (
        <>
            <div className='container1'>
                {/* Display a loader while data is being fetched */}
                {isLoading ? (
                    <div className="loader" aria-live="polite">
                        Loading workplaces...
                    </div>
                ) : (
                    // Dropdown to select a workplace
                    <select
                        className="form-select custom-select"
                        aria-label="Select a workplace"
                        onChange={onChange}
                    >
                        <option value='' disabled selected>
                            Select a workplace
                        </option>

                        {/* Map over the organizations and create dropdown options */}
                        {allOrgs.map((org, index) => (
                            <option key={index} value={index}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* Tab buttons to toggle between Swap Shifts and Drop Shifts */}
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
                        {/* Render the content based on the active tab */}
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </>
    )
};

export default Request;