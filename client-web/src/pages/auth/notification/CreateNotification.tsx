import React, { useState, useEffect } from 'react';
import Select from 'react-select';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface CreateNotificationProps {
    employees: Employee[];
    employeeId: number | null;
    onCreate: (content: string, selectedEmployeeIds: number[]) => void;
    error: string | null;
}

const CreateNotification: React.FC<CreateNotificationProps> = ({
    employees,
    employeeId,
    onCreate,
    error,
}) => {
    const [newContent, setNewContent] = useState('');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false); // New state for Select All

    // Effect to handle select all functionality
    useEffect(() => {
        if (selectAll) {
            const allEmployeeIds = employees.map(emp => emp.id);
            setSelectedEmployeeIds(allEmployeeIds);
        } else {
            setSelectedEmployeeIds([]);
        }
    }, [selectAll, employees]);

    const handleCreate = () => {
        if (!newContent.trim()) {
            alert('Notification content cannot be empty.');
            return;
        }
        if (selectedEmployeeIds.length === 0) {
            alert('Please select at least one employee to send the notification to.');
            return;
        }

        onCreate(newContent, selectedEmployeeIds);
        setNewContent('');
        setSelectedEmployeeIds([]);
        setSelectAll(false); // Reset select all checkbox
    };

    const handleSelectChange = (opts: any) => {
        const selectedIds = opts.map((opt: any) => opt.value);
        setSelectedEmployeeIds(selectedIds);
        setSelectAll(selectedIds.length === employees.length);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5>Create Notification</h5>
                {error && <div className="alert alert-danger">{error}</div>}
                <textarea
                    className="form-control mb-3"
                    placeholder="Enter notification content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                ></textarea>

                {/* Select All Checkbox */}
                <div className="form-check mb-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="selectAllCheckbox"
                        checked={selectAll}
                        onChange={(e) => setSelectAll(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="selectAllCheckbox">
                        Select All Employees
                    </label>
                </div>

                <Select
                    isMulti
                    options={employees.map((emp) => ({
                        value: emp.id,
                        label: `${emp.first_name} ${emp.last_name}`,
                    }))}
                    value={employees
                        .filter((emp) => selectedEmployeeIds.includes(emp.id))
                        .map((emp) => ({
                            value: emp.id,
                            label: `${emp.first_name} ${emp.last_name}`,
                        }))}
                    onChange={handleSelectChange}
                    className="mb-3"
                />
                <button className="btn btn-primary" onClick={handleCreate}>
                    Create Notification
                </button>
            </div>
        </div>
    );
};

export default CreateNotification;
