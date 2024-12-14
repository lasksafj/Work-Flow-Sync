import React, { useEffect, useState } from 'react';
import api from '../apis/api';
import {
    Typography,
    Card,
    List,
    ListItem,
    ListItemButton,
    Box,
    CircularProgress,
    ListItemText,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppDispatch } from '../store/hooks';
import { updateOrganization } from '../store/slices/organizationSlice';


interface Workplace {
    abbreviation: string;
    name: string;
    address: string;
}

interface SelectWorkplaceProps {
    onSelectWorkplace: (workplace: Workplace) => void;
}

const SelectWorkplace: React.FC<SelectWorkplaceProps> = ({ onSelectWorkplace }) => {
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingWorkplaces, setLoadingWorkplaces] = useState(false);
    const [isAddingWorkplace, setIsAddingWorkplace] = useState(false);

    const [name, setName] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [address, setAddress] = useState('');
    const [startDate, setStartDate] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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

    const addWorkplace = () => {
        if (!name || !abbreviation || !address || !startDate) {
            setError('All fields are required.');
            return;
        }
        api.post(`/api/workplace/add-workplace`, { name, abbreviation, address, startDate })
            .then((res) => {
                setWorkplaces((prevWorkplaces) => [...prevWorkplaces, res.data]);
                setIsAddingWorkplace(false);
                resetForm();
                setError(null);
                setSnackbarOpen(true);
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'An unexpected error occurred');
            });
    };

    const resetForm = () => {
        setName('');
        setAbbreviation('');
        setAddress('');
        setStartDate('');
        setError(null);
    };

    const handleSelectWorkplace = (workplace: Workplace) => {
        dispatch(updateOrganization(workplace));
        onSelectWorkplace(workplace);
        setSelectedWorkplace(workplace);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Typography variant="h5" gutterBottom>
                Workplaces
            </Typography>

            <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={() => setIsAddingWorkplace(true)}
            >
                Add Workplace
            </Button>

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
                                    onClick={() => handleSelectWorkplace(workplace)}
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

            <Dialog
                open={isAddingWorkplace}
                onClose={resetForm}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add New Workplace</DialogTitle>
                <DialogContent>

                    {error && (
                        <Typography color="error" sx={{ marginBottom: 1 }}>
                            {error}
                        </Typography>
                    )}
                    {/* Input fields for adding workplace details */}
                    <TextField
                        label="Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            marginBottom: 1,
                            "& .MuiInputLabel-root": {
                                transform: "translate(14px, 12px) scale(1)",
                            },
                            "& .MuiInputLabel-shrink": {
                                transform: "translate(14px, -4px) scale(0.75)",
                            },
                        }}
                    />
                    <TextField
                        label="Abbreviation"
                        fullWidth
                        value={abbreviation}
                        onChange={(e) => setAbbreviation(e.target.value)}
                        sx={{ marginBottom: 1 }}
                    />
                    <TextField
                        label="Address"
                        fullWidth
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        sx={{ marginBottom: 1 }}
                    />
                    <TextField
                        label="Start Date"
                        fullWidth
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    {/* Buttons to submit, reset, or cancel workplace addition */}
                    <Button
                        onClick={addWorkplace}
                        color="primary"
                        variant="contained"
                        startIcon={<SaveIcon />}
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={resetForm}
                        startIcon={<RefreshIcon />}
                        variant="contained"
                        style={{
                            backgroundColor: '#5dbea3',
                            color: 'white',
                        }}
                        aria-label="Reset Form"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={() => setIsAddingWorkplace(false)}
                        startIcon={<CancelIcon />}
                        variant="contained"
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Workplace added successfully!
                </Alert>
            </Snackbar>
        </>
    );
};

export default SelectWorkplace;
