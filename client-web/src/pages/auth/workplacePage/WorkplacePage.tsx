import React, { useEffect, useState } from 'react';
import api from '../../../apis/api'; // Custom API for making HTTP requests
import {
    AppBar, Toolbar, Typography, Button, TextField, Select, MenuItem,
    InputLabel, FormControl, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, IconButton, Container, Box, Divider, CircularProgress
} from '@mui/material'; // Material-UI components
import Grid from '@mui/material/Grid'; // Grid layout system from Material-UI
import CloseIcon from '@mui/icons-material/Close'; // Icons for UI actions
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from '../../../components/Avatar';
import SelectWorkplace from '../../../components/SelectWorkplace';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';


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

// List of predefined roles used in the workplace system


// Main component for managing workplaces and employees
const WorkplacePage: React.FC = () => {
    // State hooks for managing workplaces, employees, and form inputs
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

    const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null);

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isAddingWorkplace, setIsAddingWorkplace] = useState(false);
    const [name, setName] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');

    // State hooks for employee addition form
    const [isAddingEmployee, setIsAddingEmployee] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);
    const [payRate, setPayRate] = useState('');
    const [role, setRole] = useState('');
    const [isInOrg, setIsInOrg] = useState(false);

    // State for editing roles, notifications, and loading states
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [roles, setRoles] = useState<{ [key: string]: string }>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loadingWorkplaces, setLoadingWorkplaces] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [roleList, setRoleList] = useState<Role[]>([]);

    const organization = useSelector((state: RootState) => state.organization);

    // Initial fetch of workplaces when the component mounts
    useEffect(() => {
        fetchWorkplaces();
        if (organization.abbreviation)
            handleSelectWorkplace(organization);
    }, []);

    // Function to fetch workplace data from the API
    const fetchRoles = (abbreviation: string) => {
        api.get(`/api/workplace/get-roles?org=${abbreviation}`)
            .then((res) => {
                console.log('roles: ', res.data);
                setRoleList(res.data);
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message);
                setLoadingWorkplaces(false);
            });
    };

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


    // Function to select a workplace and fetch its associated employees
    const handleSelectWorkplace = (workplace: Workplace) => {
        fetchRoles(workplace.abbreviation);
        setIsEditingRole(false);
        setSelectedWorkplace(workplace);
        fetchEmployees(workplace.abbreviation);
    };

    // Fetch employees for a selected workplace by abbreviation
    const fetchEmployees = (abbreviation: string) => {
        setLoadingEmployees(true);
        api.get(`/api/workplace/get-employee-details?org=${abbreviation}`)
            .then((res) => {
                setEmployees(res.data);
                const initialRoles = res.data.reduce((acc: { [key: string]: string }, employee: Employee) => {
                    acc[employee.phone_number] = employee.role_name;
                    return acc;
                }, {});
                setRoles(initialRoles);
                setLoadingEmployees(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message);
                setLoadingEmployees(false);
            });
    };

    // Add a new workplace, ensuring all fields are filled before submission
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

    // Resets the input fields in the workplace form
    const resetForm = () => {
        setName('');
        setAbbreviation('');
        setAddress('');
        setStartDate('');
        setError(null);
    };

    // Search for an employee by phone number in the selected workplace
    const handleAddEmployee = () => {
        if (!selectedWorkplace) {
            setError('Please select a workplace first');
            return;
        }
        if (!phoneNumber) {
            setError('Please enter a phone number.');
            return;
        }
        api.get(
            `/api/workplace/search-employee?phoneNumber=${phoneNumber}&orgAbbreviation=${selectedWorkplace.abbreviation}`
        )
            .then((res) => {
                setEmployeeData(res.data.employee);
                setIsInOrg(res.data.isInOrg);
                setError(null);
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'Employee not found');
                setEmployeeData(null);
            });
    };

    // Submits an employee to be added to the selected workplace with specified role and pay rate
    const submitEmployeeToWorkplace = () => {
        if (!selectedWorkplace || !employeeData) return;
        if (!role || !payRate) {
            setError('Please fill in all fields.');
            return;
        }
        api.post(`/api/workplace/add-employee-to-workplace`, {
            employeePhoneNumber: employeeData.phone_number,
            orgAbbreviation: selectedWorkplace.abbreviation,
            role,
            payRate,
        })
            .then((res) => {
                setEmployees((prevEmployees) => [...prevEmployees, res.data]);
                resetEmployeeForm();
                setError(null);
                setSnackbarOpen(true);
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'An unexpected error occurred');
            });
    };

    // Resets the input fields in the employee form
    const resetEmployeeForm = () => {
        setIsAddingEmployee(false);
        setPhoneNumber('');
        setEmployeeData(null);
        setIsInOrg(false);
        setPayRate('');
        setRole('');
        setError(null);
    };


    // Handles role changes by updating the roles mapping for an employee
    const handleRoleChange = (phoneNumber: string, newRole: string) => {
        setRoles((prevRoles) => ({
            ...prevRoles,
            [phoneNumber]: newRole,
        }));
    };

    // Save updated roles for employees who had their role modified
    const handleSaveRole = () => {
        const changedRoles = employees.filter(
            (employee) => roles[employee.phone_number] !== employee.role_name
        );

        if (changedRoles.length === 0) {
            setIsEditingRole(false);
            return;
        }

        // Batch update roles for changed employees
        Promise.all(
            changedRoles.map((employee) => {
                const newRole = roles[employee.phone_number];
                return api.put(`/api/workplace/update-employee-role`, {
                    phoneNumber: employee.phone_number,
                    orgAbbreviation: selectedWorkplace?.abbreviation,
                    newRole,
                });
            })
        )
            .then(() => {
                setEmployees((prevEmployees) =>
                    prevEmployees.map((employee) => ({
                        ...employee,
                        role_name: roles[employee.phone_number] || employee.role_name,
                    }))
                );
                setIsEditingRole(false);
                setError(null);
                setSnackbarOpen(true);
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'An unexpected error occurred');
            });
    };

    // Closes the snackbar notification
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            {/* AppBar for navigation and adding a new workplace */}
            <AppBar
                position="static"
                sx={{
                    width: '100%', marginBottom: 2, backgroundColor: 'green',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Workplace Management
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setIsAddingWorkplace(true);
                            setIsEditingRole(false);
                        }}
                    >
                        Add Workplace
                    </Button>
                </Toolbar>
            </AppBar>

            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <SelectWorkplace
                            onSelectWorkplace={handleSelectWorkplace}
                        />
                    </Grid>
                    {/* Workplace Details Section */}
                    <Grid item xs={12} md={9}>
                        {selectedWorkplace ? (
                            <div>
                                {/* Display selected workplace details */}
                                <Typography variant="h4">{selectedWorkplace.name}</Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Address: {selectedWorkplace.address}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                                    Total Employees: {employees.length}
                                </Typography>

                                {/* Buttons to edit roles or add employees */}
                                <Box display="flex" justifyContent="flex-end" sx={{ gap: 1, marginTop: 2 }}>
                                    {isEditingRole ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<SaveIcon />}
                                                onClick={handleSaveRole}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<CancelIcon />}
                                                style={{
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                }}
                                                onClick={() => setIsEditingRole(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => setIsEditingRole(true)}
                                        >
                                            Edit Roles
                                        </Button>
                                    )}
                                    {/* Button to open the Add Employee dialog */}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => {
                                            setIsAddingEmployee(true);
                                            setIsEditingRole(false);
                                        }}
                                    >
                                        Add Employee
                                    </Button>
                                </Box>

                                {loadingEmployees ? (
                                    // Show loading spinner if employees are loading
                                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : employees.length === 0 ? (
                                    // Show message if no employees are found
                                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                                        No employees found for this workplace.
                                    </Typography>
                                ) : (
                                    // Display a grid of employee cards
                                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                        {employees.map((employee) => (
                                            <Grid item xs={12} sm={6} md={4} key={employee.phone_number}>
                                                <Card elevation={3} sx={{ minHeight: 220 }}>
                                                    <CardContent>
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            flexDirection="column"
                                                        >
                                                            {/* Employee Avatar */}
                                                            <Avatar
                                                                size={80}
                                                                img={employee.avatar}
                                                                name={employee.first_name + ' ' + employee.last_name}
                                                            />
                                                            {/* Employee name and contact details */}
                                                            <Typography variant="h6" align="center">
                                                                {employee.first_name} {employee.last_name}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                                align="center"
                                                                sx={{ wordBreak: "break-word" }}
                                                            >
                                                                Email: {employee.email}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                                align="center"
                                                                sx={{ wordBreak: "break-word" }}
                                                            >
                                                                Phone number: {employee.phone_number}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                                align="center"
                                                                sx={{ wordBreak: "break-word" }}
                                                            >
                                                                DOB: {new Date(employee.date_of_birth).toLocaleDateString()}
                                                            </Typography>
                                                            {isEditingRole ? (
                                                                // Role selection dropdown for editing
                                                                <FormControl fullWidth sx={{ marginTop: 2 }}>
                                                                    <Select
                                                                        value={roles[employee.phone_number]}
                                                                        onChange={(e) =>
                                                                            handleRoleChange(
                                                                                employee.phone_number,
                                                                                e.target.value as string
                                                                            )
                                                                        }
                                                                    >
                                                                        {roleList.map((role) => (
                                                                            <MenuItem key={role.name} value={role.name}>
                                                                                {role.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            ) : (
                                                                // Display current role when not editing
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ marginTop: 1 }}
                                                                    color="textSecondary"
                                                                >
                                                                    <strong>{employee.role_name}</strong>
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </div>
                        ) : (
                            <Typography variant="h6">
                                Please select a workplace to view details.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Dialog for Adding a New Workplace */}
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

            {/* Dialog for Adding an Employee */}
            <Dialog
                open={isAddingEmployee}
                onClose={resetEmployeeForm}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add Employee to {selectedWorkplace?.name}</DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ marginBottom: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        label="Phone Number"
                        fullWidth
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddEmployee}
                        sx={{ marginBottom: 2 }}
                        startIcon={<SearchIcon />}
                    >
                        Search Employee
                    </Button>
                    {employeeData && (
                        <div>
                            <Divider sx={{ marginBottom: 2 }} />
                            <Box
                                display="flex"
                                alignItems="center"
                                flexDirection="column"
                            >
                                <Avatar
                                    size={80}
                                    img={employeeData.avatar}
                                    name={employeeData.first_name + ' ' + employeeData.last_name}
                                />
                                <Typography variant="h6" align="center">
                                    {employeeData.first_name} {employeeData.last_name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    align="center"
                                    sx={{ wordBreak: "break-word" }}
                                >
                                    {employeeData.email}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    align="center"
                                    sx={{ wordBreak: "break-word" }}
                                >
                                    {employeeData.phone_number}
                                </Typography>
                                {isInOrg ? (
                                    <Typography
                                        color="error"
                                        sx={{ marginTop: 1 }}
                                    >
                                        Employee is already in this workplace.
                                    </Typography>
                                ) : (
                                    <div style={{ width: '100%', marginTop: '20px' }}>
                                        <FormControl fullWidth sx={{ marginTop: 1 }} variant="outlined">
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={role}
                                                onChange={(e) => setRole(e.target.value as string)}
                                                label="Role"
                                            >
                                                {roleList.map((role: Role) => (
                                                    <MenuItem key={role.name} value={role.name}>
                                                        {role.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Pay Rate"
                                            fullWidth
                                            value={payRate}
                                            onChange={(e) => setPayRate(e.target.value)}
                                            sx={{ marginTop: 1 }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={submitEmployeeToWorkplace}
                                            sx={{ marginTop: 2 }}
                                            startIcon={<SaveIcon />}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                )}
                            </Box>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={resetEmployeeForm}
                        color="secondary"
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Success Messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="Operation successful"
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleSnackbarClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </div>
    );
};

export default WorkplacePage;
