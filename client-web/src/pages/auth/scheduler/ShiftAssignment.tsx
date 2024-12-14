// ShiftAssignment.tsx

import React, { useState, useEffect } from 'react';
import {
    parse,
    isBefore,
    isAfter,
    addDays,
    getDay,
    formatISO,
    format,
    startOfDay,
} from 'date-fns';
import api from '../../../apis/api';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    Box,
    Checkbox,
    ListItemText,
    OutlinedInput,
    SelectChangeEvent,
    AppBar,
    Toolbar,
} from '@mui/material';
import SelectWorkplace from '../../../components/SelectWorkplace';
import { useAppSelector } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

// Define structure for a Workplace object
interface Workplace {
    abbreviation: string;
    name: string;
    address: string;
}

interface Availability {
    day_of_week: string;
    start_time: string; // 'HH:mm:ss' format
    end_time: string;   // 'HH:mm:ss' format
}

interface Employee {
    employee_id: number;
    phone_number: string;
    email: string;
    name: string;
    role: string;
    availability: Availability[];
}

interface Shift {
    shift_id: number;
    role: string;
    day_of_week: string;
    start_time: string; // 'HH:mm:ss' format
    end_time: string;   // 'HH:mm:ss' format
    quantity: number;
}

interface Assignment {
    employee_id: number;
    employee_name: string;
    role: string;
}

interface Role {
    name: string;
    description: string;
    org_abbreviation: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ShiftAssignment: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [assignments, setAssignments] = useState<{ [shiftKey: string]: Assignment[] }>({});
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // State for adding new shifts
    const [newShift, setNewShift] = useState<Partial<Shift>>({
        role: '',
        day_of_week: 'Monday',
        start_time: '',
        end_time: '',
        quantity: 1,
    });

    const organization = useSelector((state: RootState) => state.organization);
    const [organizationAbbreviation, setOrganizationAbbreviation] = useState<string>(organization.abbreviation); // Default value or user-selected value

    useEffect(() => {
        // Fetch data from the server
        const fetchData = async () => {
            setLoading(true);
            try {
                const orgAbbrev = organizationAbbreviation; // Replace with the selected org_abbreviation

                const [employeesRes, shiftsRes, rolesRes] = await Promise.all([
                    api.get<Employee[]>('/api/shift/get-employees', { params: { org_abbreviation: orgAbbrev } }),
                    api.get<Shift[]>('/api/shift/get-shifts', { params: { org_abbreviation: orgAbbrev } }),
                    api.get<Role[]>('/api/shift/get-roles', { params: { org_abbreviation: orgAbbrev } }),
                ]);

                setEmployees(employeesRes.data);
                setShifts(shiftsRes.data);
                setRoles(rolesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (organizationAbbreviation)
            fetchData();
    }, [organizationAbbreviation]);

    // Helper Function: Get the next date for a given day of the week
    const getNextDateForDay = (dayOfWeek: string): Date => {
        const today = new Date();
        const todayDay = getDay(today); // 0 (Sunday) to 6 (Saturday)
        const targetDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayOfWeek);

        // Calculate days until the next occurrence in the next week
        let daysUntilNext = ((targetDay - todayDay + 7) % 7) + (targetDay >= todayDay ? 7 : 0);

        const nextDate = addDays(today, daysUntilNext);
        return nextDate;
    };

    // Helper Function: Check if shift times overlap with availability
    const isTimeOverlap = (
        shiftStart: string,
        shiftEnd: string,
        availStart: string,
        availEnd: string
    ): boolean => {
        const sStart = parse(shiftStart, 'HH:mm:ss', new Date());
        const sEnd = parse(shiftEnd, 'HH:mm:ss', new Date());
        const aStart = parse(availStart, 'HH:mm:ss', new Date());
        const aEnd = parse(availEnd, 'HH:mm:ss', new Date());

        return isBefore(sStart, aEnd) && isAfter(sEnd, aStart);
    };

    // Helper Function: Check if two shifts overlap
    const shiftsOverlap = (shift1: Shift, shift2: Shift): boolean => {
        if (shift1.day_of_week !== shift2.day_of_week) return false;

        return isTimeOverlap(
            shift1.start_time,
            shift1.end_time,
            shift2.start_time,
            shift2.end_time
        );
    };

    // Helper Function: Get available employees for a shift (used for auto-assignment)
    const getAvailableEmployeesForShift = (
        shift: Shift,
        employees: Employee[],
        employeeAssignments: { [employeeId: number]: Shift[] }
    ): Employee[] => {
        return employees.filter((employee) => {
            if (employee.role !== shift.role) return false;

            // Check availability
            const availabilityForDay = employee.availability.filter(
                (avail) => avail.day_of_week === shift.day_of_week
            );

            if (availabilityForDay.length === 0) return false;

            // Check if any availability overlaps with the shift
            const isAvailable = availabilityForDay.some((avail) =>
                isTimeOverlap(
                    shift.start_time,
                    shift.end_time,
                    avail.start_time,
                    avail.end_time
                )
            );

            if (!isAvailable) return false;

            // Check if employee is already assigned to an overlapping shift
            const assignedShifts = employeeAssignments[employee.employee_id] || [];
            for (let assignedShift of assignedShifts) {
                if (shiftsOverlap(assignedShift, shift)) {
                    return false;
                }
            }

            return true;
        });
    };

    // Helper Function: Assign shifts automatically
    const assignShifts = (
        shifts: Shift[],
        employees: Employee[]
    ): { [shiftKey: string]: Assignment[] } => {
        const assignments: { [shiftKey: string]: Assignment[] } = {};

        // Keep track of employee assignments to avoid conflicts
        const employeeAssignments: { [employeeId: number]: Shift[] } = {};

        shifts.forEach((shift) => {
            const shiftKey = `${shift.shift_id}_${shift.role}`;
            const shiftAssignments: Assignment[] = [];

            // Get available employees for this shift
            const availableEmployees = getAvailableEmployeesForShift(
                shift,
                employees,
                employeeAssignments
            );

            // Assign up to shift.quantity employees
            let assignedCount = 0;
            for (const employee of availableEmployees) {
                if (assignedCount >= shift.quantity) break;

                shiftAssignments.push({
                    employee_id: employee.employee_id,
                    employee_name: employee.name,
                    role: employee.role,
                });

                // Add this shift to the employee's assignments
                if (!employeeAssignments[employee.employee_id]) {
                    employeeAssignments[employee.employee_id] = [];
                }
                employeeAssignments[employee.employee_id].push(shift);

                assignedCount++;
            }

            assignments[shiftKey] = shiftAssignments;
        });

        return assignments;
    };

    // Updated Handler: Handle form input changes with SelectChangeEvent included
    const handleNewShiftChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = event.target;
        setNewShift((prev) => ({
            ...prev,
            [name as string]:
                name === 'quantity'
                    ? parseInt(value as string, 10)
                    : value,
        }));
    };

    // Handle form submission to add a new shift
    const handleAddShift = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orgAbbrev = organizationAbbreviation;

            const newShiftData = {
                role: newShift.role,
                day_of_week: newShift.day_of_week,
                start_time: newShift.start_time,
                end_time: newShift.end_time,
                quantity: newShift.quantity !== undefined ? newShift.quantity : 0,
                org_abbreviation: orgAbbrev,
            };

            // Send POST request to server to add/update the shift
            await api.post<Shift>('/api/shift/add-shifts', newShiftData);

            // After adding/updating shift, fetch shifts again
            const shiftsRes = await api.get<Shift[]>('/api/shift/get-shifts', { params: { org_abbreviation: orgAbbrev } });

            setShifts(shiftsRes.data);

            // Reset form
            setNewShift({
                role: '',
                day_of_week: 'Monday',
                start_time: '',
                end_time: '',
                quantity: 1,
            });

            setSuccess('Shift added successfully.');
        } catch (error: any) {
            console.error('Error adding shift:', error);
            if (error.response && error.response.data) {
                setError(`Error adding shift: ${error.response.data}`);
            } else {
                setError('Error adding shift.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle manual assignment change
    const handleAssignmentChange = (
        shiftKey: string,
        selectedEmployeeIds: number[]
    ) => {
        const updatedAssignments = { ...assignments };
        const assignedEmployees = selectedEmployeeIds.map((empId) => {
            const employee = employees.find((e) => e.employee_id === empId);
            if (!employee) return null;
            return {
                employee_id: employee.employee_id,
                employee_name: employee.name,
                role: employee.role,
            };
        }).filter((a): a is Assignment => a !== null);
        updatedAssignments[shiftKey] = assignedEmployees;
        setAssignments(updatedAssignments);
    };

    // Auto-assign shifts when the button is clicked
    const handleAutoAssign = () => {
        const assigned = assignShifts(shifts, employees);
        setAssignments(assigned);
        setSuccess('Shifts auto-assigned successfully.');
    };

    // Apply assignments to create schedules in the database
    const handleApplyAssignments = async () => {
        setLoading(true);
        try {
            // Prepare the data to send to the server
            const schedules = [] as any;

            for (const shift of shifts) {
                const shiftKey = `${shift.shift_id}_${shift.role}`;
                if (assignments[shiftKey]) {
                    // Get the date for the next occurrence of the shift's day_of_week
                    const shiftDate = startOfDay(getNextDateForDay(shift.day_of_week));

                    // Combine date with start_time and end_time to create timestamps
                    const shiftStartTime = formatISO(
                        new Date(`${shiftDate.toISOString().split('T')[0]}T${shift.start_time}`)
                    );
                    const shiftEndTime = formatISO(
                        new Date(`${shiftDate.toISOString().split('T')[0]}T${shift.end_time}`)
                    );

                    assignments[shiftKey].forEach(assignment => {
                        schedules.push({
                            shift_id: shift.shift_id,
                            employee_id: assignment.employee_id,
                            start_time: shiftStartTime,
                            end_time: shiftEndTime,
                            role: assignment.role,
                            organization_abbreviation: organizationAbbreviation,
                        });
                    });
                }
            }

            // Send POST request to server to create schedules
            await api.post('/api/shift/assign-shifts', { schedules });

            setSuccess('Assignments applied successfully.');
        } catch (error) {
            console.error('Error applying assignments:', error);
            setError('Failed to apply assignments.');
        } finally {
            setLoading(false);
        }
    };

    // Helper Function: Get the numeric value of a day for sorting (0 = Sunday, 6 = Saturday)
    const getDayValue = (day: string): number => {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
    };

    // Sort shifts based on day of the week and start time
    const sortedShifts = [...shifts].sort((a, b) => {
        const dayComparison = getDayValue(a.day_of_week) - getDayValue(b.day_of_week);
        if (dayComparison !== 0) {
            return dayComparison;
        } else {
            // Compare start times
            const timeA = parse(a.start_time, 'HH:mm:ss', new Date());
            const timeB = parse(b.start_time, 'HH:mm:ss', new Date());
            return timeA.getTime() - timeB.getTime();
        }
    });

    // Group shifts by day
    const shiftsByDay = sortedShifts.reduce((acc, shift) => {
        if (!acc[shift.day_of_week]) {
            acc[shift.day_of_week] = [];
        }
        acc[shift.day_of_week].push(shift);
        return acc;
    }, {} as { [day: string]: Shift[] });

    // Custom styles for multi-select
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    // Define the border style for table cells
    const cellBorderStyle = { borderRight: '1px solid rgba(224, 224, 224, 1)' };

    // Function to select a workplace and fetch its associated employees
    const handleSelectWorkplace = (workplace: Workplace) => {
        setOrganizationAbbreviation(workplace.abbreviation);
    };

    return (
        <div>
            <AppBar position="static" sx={{ marginBottom: 2 }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Shift Assignments
                    </Typography>
                </Toolbar>
            </AppBar>

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

                                {/* Add New Shift Form */}
                                <Box component="form" onSubmit={handleAddShift} sx={{ mb: 4 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Add New Shift
                                    </Typography>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6} md={3}>
                                            <FormControl fullWidth required>
                                                <InputLabel id="role-label">Role</InputLabel>
                                                <Select
                                                    labelId="role-label"
                                                    name="role"
                                                    value={newShift.role || ''}
                                                    label="Role"
                                                    onChange={handleNewShiftChange}
                                                >
                                                    {roles.map((role) => (
                                                        <MenuItem key={role.name} value={role.name}>
                                                            {role.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="day-of-week-label">Day of Week</InputLabel>
                                                <Select
                                                    labelId="day-of-week-label"
                                                    name="day_of_week"
                                                    value={newShift.day_of_week || 'Monday'}
                                                    label="Day of Week"
                                                    onChange={handleNewShiftChange}
                                                >
                                                    {daysOfWeek.map((day) => (
                                                        <MenuItem key={day} value={day}>
                                                            {day}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={2}>
                                            <TextField
                                                label="Start Time"
                                                name="start_time"
                                                type="time"
                                                value={newShift.start_time || ''}
                                                onChange={handleNewShiftChange}
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={2}>
                                            <TextField
                                                label="End Time"
                                                name="end_time"
                                                type="time"
                                                value={newShift.end_time || ''}
                                                onChange={handleNewShiftChange}
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={1}>
                                            <TextField
                                                label="Quantity"
                                                name="quantity"
                                                type="number"
                                                value={newShift.quantity !== undefined ? newShift.quantity : ''}
                                                onChange={handleNewShiftChange}
                                                required
                                                inputProps={{ min: 1 }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={1}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                disabled={loading}
                                            >
                                                {loading ? <CircularProgress size={24} /> : 'Add'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ mb: 4 }}>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={handleAutoAssign}
                                                disabled={loading || shifts.length === 0 || employees.length === 0}
                                            >
                                                Auto-Assign Shifts
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleApplyAssignments}
                                                disabled={loading || Object.keys(assignments).length === 0}
                                            >
                                                {loading ? <CircularProgress size={24} /> : 'Apply Assignments'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Employee Availability */}
                                <Typography variant="h6" gutterBottom>
                                    Employee Availability
                                </Typography>
                                <TableContainer component={Paper} sx={{ mb: 4 }}>
                                    <Table sx={{ borderCollapse: 'collapse' }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={cellBorderStyle}><strong>Employee</strong></TableCell>
                                                {daysOfWeek.map((day, index) => (
                                                    <TableCell
                                                        key={day}
                                                        align="center"
                                                        sx={index < daysOfWeek.length - 1 ? cellBorderStyle : {}}
                                                    >
                                                        <strong>{day}</strong>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {employees.map((emp) => (
                                                <TableRow key={emp.employee_id}>
                                                    <TableCell sx={cellBorderStyle}>{emp.name}</TableCell>
                                                    {daysOfWeek.map((day, index) => {
                                                        const availabilities = emp.availability.filter(a => a.day_of_week === day);
                                                        return (
                                                            <TableCell
                                                                key={day}
                                                                align="center"
                                                                sx={index < daysOfWeek.length - 1 ? cellBorderStyle : {}}
                                                            >
                                                                {availabilities.length > 0 ? (
                                                                    availabilities.map((avail, index) => (
                                                                        <Typography variant="body2" key={index}>
                                                                            {format(parse(avail.start_time, 'HH:mm:ss', new Date()), 'hh:mm a')} - {format(parse(avail.end_time, 'HH:mm:ss', new Date()), 'hh:mm a')} ({emp.role})
                                                                        </Typography>
                                                                    ))
                                                                ) : (
                                                                    <Typography variant="body2">-</Typography>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Shift Assignments */}
                                <Typography variant="h6" gutterBottom>
                                    Shift Assignments
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Day</strong></TableCell>
                                                <TableCell><strong>Role</strong></TableCell>
                                                <TableCell><strong>Time</strong></TableCell>
                                                <TableCell><strong>Assigned Employees</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.keys(shiftsByDay).map((day) => {
                                                const shiftsForDay = shiftsByDay[day];
                                                return shiftsForDay.map((shift, index) => {
                                                    const shiftKey = `${shift.shift_id}_${shift.role}`;
                                                    const allEmployeesForShift = employees.filter(
                                                        (employee) => employee.role === shift.role
                                                    );
                                                    return (
                                                        <TableRow key={shiftKey}>
                                                            {index === 0 && (
                                                                <TableCell rowSpan={shiftsForDay.length}>
                                                                    {shift.day_of_week}
                                                                </TableCell>
                                                            )}
                                                            <TableCell>{shift.role}</TableCell>
                                                            <TableCell>
                                                                {format(parse(shift.start_time, 'HH:mm:ss', new Date()), 'hh:mm a')} -{' '}
                                                                {format(parse(shift.end_time, 'HH:mm:ss', new Date()), 'hh:mm a')}
                                                            </TableCell>
                                                            <TableCell>
                                                                <FormControl sx={{ width: 300 }}>
                                                                    <InputLabel id={`assign-label-${shiftKey}`}>Assign Employees</InputLabel>
                                                                    <Select<number[]>
                                                                        labelId={`assign-label-${shiftKey}`}
                                                                        multiple
                                                                        value={
                                                                            assignments[shiftKey]
                                                                                ? assignments[shiftKey].map((assignment) => assignment.employee_id)
                                                                                : []
                                                                        }
                                                                        onChange={(e: SelectChangeEvent<number[]>) => {
                                                                            const value = e.target.value as number[];
                                                                            handleAssignmentChange(shiftKey, value);
                                                                        }}
                                                                        input={<OutlinedInput label="Assign Employees" />}
                                                                        renderValue={(selected) => {
                                                                            const selectedIds = selected as number[];
                                                                            const names = selectedIds.map((id) => {
                                                                                const emp = employees.find((e) => e.employee_id === id);
                                                                                return emp ? emp.name : '';
                                                                            });
                                                                            return names.join(', ');
                                                                        }}
                                                                        MenuProps={MenuProps}
                                                                    >
                                                                        {allEmployeesForShift.map((emp) => (
                                                                            <MenuItem key={emp.employee_id} value={emp.employee_id}>
                                                                                <Checkbox checked={assignments[shiftKey]?.some(a => a.employee_id === emp.employee_id) || false} />
                                                                                <ListItemText primary={emp.name} />
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                                    Assigned: {assignments[shiftKey]?.length || 0}/{shift.quantity}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                });
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

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

export default ShiftAssignment;
