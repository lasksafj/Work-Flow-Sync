import api from "../../../apis/api";
import React, { useState, useEffect } from 'react';
import NotificationList from './NotificationList';
import CreateNotification from './CreateNotification';
import SelectWorkplace from '../../../components/SelectWorkplace';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Alert, Box, CircularProgress, Container, Grid, Snackbar, Typography } from '@mui/material';

interface Notification {
    id: number;
    content: string;
    created_date: string;
    last_name: string;
    first_name: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface Workplace {
    abbreviation: string;
    name: string;
    address: string;
}

const NotificationsPage: React.FC = () => {
    const organization = useSelector((state: RootState) => state.organization);
    const [organizationAbbreviation, setOrganizationAbbreviation] = useState<string>(organization.abbreviation); // Default value or user-selected value
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeId, setEmployeeId] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                fetchEmployees(organizationAbbreviation);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Please select an organization to view and create notifications.');
            } finally {
                setLoading(false);
            }
        };
        if (organizationAbbreviation)
            fetchData();
    }, [organizationAbbreviation]);

    useEffect(() => {
        loadNotifications(page, organizationAbbreviation);
    }, [page, organizationAbbreviation]);
    
    // Function to select a workplace and fetch its associated employees
    const handleSelectWorkplace = (workplace: Workplace) => {
        setOrganizationAbbreviation(workplace.abbreviation);
        setPage(1); // Reset pagination to the first page
    };

    const fetchEmployees = (orgAbbreviation: string) => {
        api.get('/api/notification/employees-fetch', {
            params: { org: orgAbbreviation }
        })
            .then((res) => {
                setEmployees(res.data);
                const currentUserEmployee = res.data.find(
                    (employee: Employee) => employee.id === employeeId
                );
                if (currentUserEmployee) setEmployeeId(currentUserEmployee.id);
            })
            .catch((err) => {
                setError('Failed to load employees.');
                console.log(err);
            });
    };

    const loadNotifications = (pageNumber: number, orgAbbreviation: string | null) => {
        if (!orgAbbreviation) {
            return;
        }

        api.get("/api/notification/notifications-fetch", {
            params: {
                offset: (pageNumber - 1) * pageSize,
                limit: pageSize,
                org: orgAbbreviation,
            }
        })
            .then((res) => {
                setNotifications(res.data.notifications);
                setTotalPages(Math.ceil(res.data.total / pageSize));
            })
            .catch((err) => {
                setError("Failed to load notifications. Please try again later.");
                console.log(err);
            });
    };

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
        if (organization && employeeId) {
            loadNotifications(pageNumber, organizationAbbreviation);
        }
    };

    const handleCreateNotification = (content: string, selectedEmployeeIds: number[]) => {
        api.post('/api/notification/notification-create', {
            content,
            receiver_ids: selectedEmployeeIds,
            org_abbr: organizationAbbreviation,
        })
            .then((res) => {
                const newNotification = res.data;
                setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
            })
            .catch((err) => {
                setError('Failed to create notification.');
                console.log(err);
            });
    };

    return (
        <div style={{ paddingTop: 20 }}>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={3} md={3}>
                        <SelectWorkplace
                            onSelectWorkplace={handleSelectWorkplace}
                        />
                    </Grid>
                    <Grid item xs={9} md={9}>
                        {organizationAbbreviation ? (
                            <Container maxWidth="lg" sx={{ py: 4 }}>

                                {/* Snackbar for Success Messages */}
                                <Snackbar
                                    open={!!success}
                                    autoHideDuration={6000}
                                    onClose={() => setSuccess('')}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                >
                                    <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                                        {success}
                                    </Alert>
                                </Snackbar>

                                {/* Snackbar for Error Messages */}
                                <Snackbar
                                    open={!!error}
                                    autoHideDuration={6000}
                                    onClose={() => setError('')}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                >
                                    <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                                        {error}
                                    </Alert>
                                </Snackbar>

                                {/* Create Notification Section */}
                                <CreateNotification
                                    employees={employees}
                                    employeeId={employeeId}
                                    onCreate={handleCreateNotification}
                                    error={error}
                                />

                                {/* Notifications Section */}
                                <h4 className="mt-4">Notifications</h4>
                                <NotificationList
                                    notifications={notifications}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    currentPage={page}
                                />
                                {/* Loading Indicator Overlay */}
                                {loading && (
                                    <Box
                                        sx={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 1300,
                                        }}
                                    >
                                        <CircularProgress color="inherit" size={80} />
                                    </Box>
                                )}
                            </Container>
                        )
                            :
                            (
                                <Typography variant="h6">
                                    Please select a workplace to view details.
                                </Typography>
                            )
                        }
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default NotificationsPage;
