import React, { useEffect, useState } from 'react';
import DropShift from './DropShift';
import SwapShift from './SwapShift';
import '../css/request.css';
import api from '../../../apis/api';
import SelectWorkplace from '../../../components/SelectWorkplace';
import { Container, Grid } from '@mui/material';

// Define the interface for organization properties
interface AllOrgsProps {
    abbreviation: string,
    name: string,
}

// Define structure for a Workplace object
interface Workplace {
    abbreviation: string;
    name: string;
    address: string;
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

    // Function to select a workplace and fetch its associated employees
    const handleSelectWorkplace = (workplace: Workplace) => {
        setAbbreviation(workplace.abbreviation);
    };
    
    // Render the component
    return (
        <div>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={3} md={3}>
                        <SelectWorkplace
                            onSelectWorkplace={handleSelectWorkplace}
                        />
                    </Grid>

                    <Grid item xs={9} md={9}>
                        <div className='container1'>

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
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Request;