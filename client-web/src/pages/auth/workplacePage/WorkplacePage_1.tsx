import React, { useEffect, useState } from 'react';
import api from '../../../apis/api';
import './WorkplacePage.css'; // Import the CSS file

interface Employee {
    id: number;
    role_name: string;
    email: string;
    last_name: string;
    first_name: string;
    phone_number: string;
    date_of_birth: string; 
    avatar?: string;
}

interface Workplace {
    abbreviation: string;
    name: string;
    address: string;
}

const WorkplacePage: React.FC = () => {
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);

    // State for global edit mode for workplaces
    const [isWorkplaceEditMode, setIsWorkplaceEditMode] = useState<boolean>(false);

    // State for per-row editing workplaces
    const [editingWorkplaceId, setEditingWorkplaceId] = useState<string | null>(null);
    const [editWorkplaceForm, setEditWorkplaceForm] = useState<{ name: string; address: string }>({ name: '', address: '' });

    // State for adding workplaces
    const [isAddingWorkplace, setIsAddingWorkplace] = useState<boolean>(false);
    const [addWorkplaceForm, setAddWorkplaceForm] = useState<{ abbreviation: string; name: string; address: string }>({
        abbreviation: '',
        name: '',
        address: '',
    });

    // State for global edit mode for employees
    const [isEmployeeEditMode, setIsEmployeeEditMode] = useState<boolean>(false);

    // State for per-row editing employees
    const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
    const [editEmployeeForm, setEditEmployeeForm] = useState<{ role_name: string }>({
        role_name: '',
    });

    // State for adding employees
    const [isAddingEmployee, setIsAddingEmployee] = useState<boolean>(false);
    const [addEmployeeForm, setAddEmployeeForm] = useState<{ first_name: string; last_name: string; email: string; phone_number: string; role_name: string; date_of_birth: string }>({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role_name: '',
        date_of_birth: '',
    });

    useEffect(() => {
        fetchWorkplaces();
    }, []);

    const fetchWorkplaces = () => {
        api
            .get('/api/workplace/get-org')
            .then((res) => {
                let data = res.data;
                setWorkplaces(data);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleSelectWorkplace = (workplace: Workplace) => {
        setSelectedWorkplace(workplace);
        fetchEmployees(workplace.abbreviation);
    };

    const fetchEmployees = (abbreviation: string) => {
        api.get(`/api/workplace/get-employee-details?org=${abbreviation}`)
            .then((res) => {
                let employee_data = res.data;
                setEmployees(employee_data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const generateAvatarUrl = (firstName: string, lastName: string, id: number) => {
        const color = generateColorFromString(`${firstName}${lastName}${id}`);
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&background=${color}&color=fff`;
    };

    const generateColorFromString = (input: string) => {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = input.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}`;
        return color.slice(1); // Removing '#' as ui-avatars expects color code without it
    };

    /* ============================
       Workplace Handlers
    =============================*/

    const handleGlobalWorkplaceEdit = () => {
        setIsWorkplaceEditMode(true);
    };

    const handleGlobalWorkplaceSave = () => {
        setIsWorkplaceEditMode(false);
        alert('All workplace changes have been saved.');
    };

    const handleGlobalWorkplaceCancel = () => {
        fetchWorkplaces();
        setIsWorkplaceEditMode(false);
        setEditingWorkplaceId(null);
        setIsAddingWorkplace(false);
        setEditWorkplaceForm({ name: '', address: '' });
        setAddWorkplaceForm({ abbreviation: '', name: '', address: '' });
    };

    const handleEditWorkplaceClick = (workplace: Workplace) => {
        setEditingWorkplaceId(workplace.abbreviation);
        setEditWorkplaceForm({ name: workplace.name, address: workplace.address });
        setIsAddingWorkplace(false);
    };

    const handleCancelWorkplaceEdit = () => {
        setEditingWorkplaceId(null);
        setEditWorkplaceForm({ name: '', address: '' });
    };

    const handleSaveWorkplaceEdit = (abbreviation: string) => {
        api
            .put(`/api/workplace/update-org/${abbreviation}`, {
                name: editWorkplaceForm.name,
                address: editWorkplaceForm.address,
            })
            .then((res) => {
                setWorkplaces((prevWorkplaces) =>
                    prevWorkplaces.map((wp) =>
                        wp.abbreviation === abbreviation
                            ? { ...wp, name: editWorkplaceForm.name, address: editWorkplaceForm.address }
                            : wp
                    )
                );
                setEditingWorkplaceId(null);
                setEditWorkplaceForm({ name: '', address: '' });
                alert('Workplace updated successfully.');
            })
            .catch((err) => {
                alert('Failed to update workplace: ' + err.message);
            });
    };

    const handleDeleteWorkplace = (abbreviation: string) => {
        if (!window.confirm('Are you sure you want to delete this workplace?')) return;
        api
            .delete(`/api/workplace/delete-org/${abbreviation}`)
            .then((res) => {
                setWorkplaces((prevWorkplaces) =>
                    prevWorkplaces.filter((wp) => wp.abbreviation !== abbreviation)
                );
                if (selectedWorkplace?.abbreviation === abbreviation) {
                    setSelectedWorkplace(null);
                    setEmployees([]);
                }
                alert('Workplace deleted successfully.');
            })
            .catch((err) => {
                alert('Failed to delete workplace: ' + err.message);
            });
    };

    const handleAddWorkplaceClick = () => {
        setIsAddingWorkplace(true);
        setEditingWorkplaceId(null);
    };

    const handleCancelAddWorkplace = () => {
        setIsAddingWorkplace(false);
        setAddWorkplaceForm({ abbreviation: '', name: '', address: '' });
    };

    const handleSaveAddWorkplace = () => {
        if (!addWorkplaceForm.abbreviation || !addWorkplaceForm.name || !addWorkplaceForm.address) {
            alert('All fields are required for adding a workplace.');
            return;
        }
        api
            .post('/api/workplace/add-org', {
                abbreviation: addWorkplaceForm.abbreviation,
                name: addWorkplaceForm.name,
                address: addWorkplaceForm.address,
            })
            .then((res) => {
                setWorkplaces((prevWorkplaces) => [...prevWorkplaces, addWorkplaceForm]);
                setIsAddingWorkplace(false);
                setAddWorkplaceForm({ abbreviation: '', name: '', address: '' });
                alert('Workplace added successfully.');
            })
            .catch((err) => {
                alert('Failed to add workplace: ' + err.message);
            });
    };

    const handleEditWorkplaceFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditWorkplaceForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddWorkplaceFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddWorkplaceForm((prev) => ({ ...prev, [name]: value }));
    };

    /* ============================
       Employee Handlers
    =============================*/

    const handleGlobalEmployeeEdit = () => {
        setIsEmployeeEditMode(true);
    };

    const handleGlobalEmployeeSave = () => {
        setIsEmployeeEditMode(false);
        alert('All employee changes have been saved.');
    };

    const handleGlobalEmployeeCancel = () => {
        if (selectedWorkplace) {
            fetchEmployees(selectedWorkplace.abbreviation);
        }
        setIsEmployeeEditMode(false);
        setEditingEmployeeId(null);
        setIsAddingEmployee(false);
        setEditEmployeeForm({ role_name: '' });
        setAddEmployeeForm({ first_name: '', last_name: '', email: '', phone_number: '', role_name: '', date_of_birth: '' });
    };

    const handleEditEmployeeClick = (employee: Employee) => {
        setEditingEmployeeId(employee.id);
        setEditEmployeeForm({
            role_name: employee.role_name,
        });
        setIsAddingEmployee(false);
    };

    const handleCancelEmployeeEdit = () => {
        setEditingEmployeeId(null);
        setEditEmployeeForm({ role_name: '' });
    };

    const handleSaveEmployeeEdit = (id: number) => {
        api
            .put(`/api/workplace/update-employee/${id}`, {
                role_name: editEmployeeForm.role_name,
            })
            .then((res) => {
                setEmployees((prevEmployees) =>
                    prevEmployees.map((emp) =>
                        emp.id === id
                            ? { ...emp, role_name: editEmployeeForm.role_name }
                            : emp
                    )
                );
                setEditingEmployeeId(null);
                setEditEmployeeForm({ role_name: '' });
                alert('Employee updated successfully.');
            })
            .catch((err) => {
                alert('Failed to update employee: ' + err.message);
            });
    };

    const handleDeleteEmployee = (id: number) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        api
            .delete(`/api/workplace/delete-employee/${id}`)
            .then((res) => {
                setEmployees((prevEmployees) =>
                    prevEmployees.filter((emp) => emp.id !== id)
                );
                alert('Employee deleted successfully.');
            })
            .catch((err) => {
                alert('Failed to delete employee: ' + err.message);
            });
    };

    const handleAddEmployeeClick = () => {
        setIsAddingEmployee(true);
        setEditingEmployeeId(null);
    };

    const handleCancelAddEmployee = () => {
        setIsAddingEmployee(false);
        setAddEmployeeForm({ first_name: '', last_name: '', email: '', phone_number: '', role_name: '', date_of_birth: '' });
    };

    const handleSaveAddEmployee = () => {
        const { first_name, last_name, email, phone_number, role_name, date_of_birth } = addEmployeeForm;
        if (!first_name || !last_name || !email || !phone_number || !role_name || !date_of_birth) {
            alert('All fields are required for adding an employee.');
            return;
        }
        if (!selectedWorkplace) {
            alert('No workplace selected.');
            return;
        }
        api
            .post('/api/workplace/add-employee', {
                first_name,
                last_name,
                email,
                phone_number,
                role_name,
                date_of_birth,
                org_abbreviation: selectedWorkplace.abbreviation,
            })
            .then((res) => {
                const newEmployee: Employee = res.data;
                setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
                setIsAddingEmployee(false);
                setAddEmployeeForm({ first_name: '', last_name: '', email: '', phone_number: '', role_name: '', date_of_birth: '' });
                alert('Employee added successfully.');
            })
            .catch((err) => {
                alert('Failed to add employee: ' + err.message);
            });
    };

    const handleEditEmployeeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditEmployeeForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEmployeeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddEmployeeForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="workplace-page">
            <div className="right-column">
                <h2>Workplaces</h2>
                <div className="global-action-buttons">
                    {!isWorkplaceEditMode ? (
                        <button className="btn primary" onClick={handleGlobalWorkplaceEdit}>Edit</button>
                    ) : (
                        <div className="button-group">
                            <button className="btn success" onClick={handleGlobalWorkplaceSave}>Save</button>
                            <button className="btn danger" onClick={handleGlobalWorkplaceCancel}>Cancel</button>
                            <button className="btn primary" onClick={handleAddWorkplaceClick}>Add Workplace</button>
                        </div>
                    )}
                </div>
                <ul className="workplaces-list">
                    {workplaces.map((workplace) => (
                        <li key={workplace.abbreviation} className="workplace-item">
                            <div className="workplace-details">
                                <button className="workplace-button" onClick={() => handleSelectWorkplace(workplace)}>
                                    {workplace.name}
                                </button>
                                <p className="workplace-address">{workplace.address}</p>
                            </div>
                            {isWorkplaceEditMode && (
                                <div className="workplace-actions">
                                    {editingWorkplaceId === workplace.abbreviation ? (
                                        <div className="edit-form">
                                            <input
                                                type="text"
                                                name="name"
                                                value={editWorkplaceForm.name}
                                                onChange={handleEditWorkplaceFormChange}
                                                placeholder="Name"
                                                className="input-field"
                                            />
                                            <input
                                                type="text"
                                                name="address"
                                                value={editWorkplaceForm.address}
                                                onChange={handleEditWorkplaceFormChange}
                                                placeholder="Address"
                                                className="input-field"
                                            />
                                            <button className="btn success" onClick={() => handleSaveWorkplaceEdit(workplace.abbreviation)}>Save</button>
                                            <button className="btn danger" onClick={handleCancelWorkplaceEdit}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="button-group">
                                            <button className="btn primary" onClick={() => handleEditWorkplaceClick(workplace)}>Edit</button>
                                            <button className="btn danger" onClick={() => handleDeleteWorkplace(workplace.abbreviation)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                {isWorkplaceEditMode && isAddingWorkplace && (
                    <div className="add-form">
                        <h3>Add New Workplace</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                name="abbreviation"
                                value={addWorkplaceForm.abbreviation}
                                onChange={handleAddWorkplaceFormChange}
                                placeholder="Abbreviation"
                                className="input-field"
                            />
                            <input
                                type="text"
                                name="name"
                                value={addWorkplaceForm.name}
                                onChange={handleAddWorkplaceFormChange}
                                placeholder="Name"
                                className="input-field"
                            />
                            <input
                                type="text"
                                name="address"
                                value={addWorkplaceForm.address}
                                onChange={handleAddWorkplaceFormChange}
                                placeholder="Address"
                                className="input-field"
                            />
                        </div>
                        <div className="button-group">
                            <button className="btn success" onClick={handleSaveAddWorkplace}>Add</button>
                            <button className="btn danger" onClick={handleCancelAddWorkplace}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="left-column">
                {selectedWorkplace ? (
                    <div className="selected-workplace">
                        <h3>Selected Workplace</h3>
                        <p><strong>Name:</strong> {selectedWorkplace.name}</p>
                        <p><strong>Address:</strong> {selectedWorkplace.address}</p>
                    </div>
                ) : (
                    <div className="placeholder">
                        <p>Please select a workplace to view details and employees.</p>
                    </div>
                )}

                {selectedWorkplace && (
                    <div className="employees-section">
                        <h3>Employees</h3>
                        <div className="employees-global-action-buttons">
                            {!isEmployeeEditMode ? (
                                <button className="btn primary" onClick={handleGlobalEmployeeEdit}>Edit</button>
                            ) : (
                                <div className="button-group">
                                    <button className="btn success" onClick={handleGlobalEmployeeSave}>Save</button>
                                    <button className="btn danger" onClick={handleGlobalEmployeeCancel}>Cancel</button>
                                    <button className="btn primary" onClick={handleAddEmployeeClick}>Add Employee</button>
                                </div>
                            )}
                        </div>
                        <ul className="employees-list">
                            {employees.map((employee) => (
                                <li key={employee.id} className="employee-item">
                                    <div className="employee-info">
                                        <img
                                            src={
                                                employee.avatar
                                                    ? employee.avatar
                                                    : generateAvatarUrl(employee.first_name, employee.last_name, employee.id)
                                            }
                                            alt={`${employee.first_name} ${employee.last_name}'s avatar`}
                                            className="employee-avatar"
                                        />
                                        <div className="employee-details">
                                            {editingEmployeeId === employee.id && isEmployeeEditMode ? (
                                                <div className="employee-edit-form">
                                                    <p><strong>Name:</strong> {employee.first_name} {employee.last_name}</p>
                                                    <p><strong>Email:</strong> {employee.email}</p>
                                                    <p><strong>Phone:</strong> {employee.phone_number}</p>
                                                    <p><strong>DOB:</strong> {new Date(employee.date_of_birth).toLocaleDateString()}</p>
                                                    <input
                                                        type="text"
                                                        name="role_name"
                                                        value={editEmployeeForm.role_name}
                                                        onChange={handleEditEmployeeFormChange}
                                                        placeholder="Role"
                                                        className="input-field"
                                                    />
                                                    <div className="button-group">
                                                        <button className="btn success" onClick={() => handleSaveEmployeeEdit(employee.id)}>Save</button>
                                                        <button className="btn danger" onClick={handleCancelEmployeeEdit}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p><strong>Name:</strong> {employee.first_name} {employee.last_name}</p>
                                                    <p><strong>Role:</strong> {employee.role_name}</p>
                                                    <p><strong>Email:</strong> {employee.email}</p>
                                                    <p><strong>Phone:</strong> {employee.phone_number}</p>
                                                    <p><strong>DOB:</strong> {new Date(employee.date_of_birth).toLocaleDateString()}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {isEmployeeEditMode && (
                                        <div className="employee-actions">
                                            <div className="button-group">
                                                <button className="btn primary" onClick={() => handleEditEmployeeClick(employee)}>Edit Role</button>
                                                <button className="btn danger" onClick={() => handleDeleteEmployee(employee.id)}>Remove</button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {isEmployeeEditMode && isAddingEmployee && (
                            <div className="add-employee-form">
                                <h3>Add New Employee</h3>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={addEmployeeForm.first_name}
                                        onChange={handleAddEmployeeFormChange}
                                        placeholder="First Name"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={addEmployeeForm.last_name}
                                        onChange={handleAddEmployeeFormChange}
                                        placeholder="Last Name"
                                        className="input-field"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={addEmployeeForm.email}
                                        onChange={handleAddEmployeeFormChange}
                                        placeholder="Email"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={addEmployeeForm.phone_number}
                                        onChange={handleAddEmployeeFormChange}
                                        placeholder="Phone Number"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        name="role_name"
                                        value={addEmployeeForm.role_name}
                                        onChange={handleAddEmployeeFormChange}
                                        placeholder="Role"
                                        className="input-field"
                                    />
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={addEmployeeForm.date_of_birth}
                                        onChange={handleAddEmployeeFormChange}
                                        className="input-field"
                                    />
                                </div>
                                <div className="button-group">
                                    <button className="btn success" onClick={handleSaveAddEmployee}>Add</button>
                                    <button className="btn danger" onClick={handleCancelAddEmployee}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkplacePage;
