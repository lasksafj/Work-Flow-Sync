import React, { useEffect, useState } from 'react';
import api from '../apis/api';
import {
    Typography,
    Card, List, ListItem,
    ListItemButton,
    Box, CircularProgress, ListItemText
} from '@mui/material'; // Material-UI components
import Grid from '@mui/material/Grid'; // Grid layout system from Material-UI
import { useAppDispatch } from '../store/hooks';
import { updateOrganization } from '../store/slices/organizationSlice';

// Define structure for an Employee object with optional avatar property
interface Employee {
    role_name: string;
    email: string;
    last_name: string;
    first_name: string;
    phone_number: string;
    date_of_birth: string;
    avatar?: string;
}

// Define structure for a Workplace object
interface Workplace {
    abbreviation: string;
    name: string;
    address: string;
}

interface Role {
    name: string;
}

interface SelectWorkplaceProps {
    onSelectWorkplace: (workplace: Workplace) => void;
}

const SelectWorkplace: React.FC<SelectWorkplaceProps> = ({ onSelectWorkplace }) => {

    // State hooks for managing workplaces, employees, and form inputs
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null);
    const [error, setError] = useState<string | null>(null);

    // State for editing roles, notifications, and loading states
    const [loadingWorkplaces, setLoadingWorkplaces] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        fetchWorkplaces();
    }, []);

    const fetchWorkplaces = () => {
        setLoadingWorkplaces(true);
        api.get('/api/workplace/get-org')
            .then((res) => {
                setWorkplaces(res.data);
                setLoadingWorkplaces(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message);
                setLoadingWorkplaces(false);
            });
    };


    const handleSelectWorkplace = (workplace: Workplace) => {
        dispatch(updateOrganization(workplace));
        onSelectWorkplace(workplace);
        setSelectedWorkplace(workplace);
    };


    return (
        <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
                Workplaces
            </Typography>
            <Card variant="outlined">
                {loadingWorkplaces ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                        {workplaces.map((workplace) => (
                            <ListItem key={workplace.abbreviation} disablePadding>
                                <ListItemButton
                                    selected={
                                        selectedWorkplace?.abbreviation === workplace.abbreviation
                                    }
                                    onClick={() => { handleSelectWorkplace(workplace) }}
                                >
                                    <ListItemText
                                        primary={workplace.name}
                                        secondary={workplace.address}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Card>
        </Grid>

    );
};

export default SelectWorkplace;

