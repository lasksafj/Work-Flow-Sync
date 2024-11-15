import api from "../../../apis/api";
import React, { useState, useEffect } from 'react';
import './NotificationsPage.css';
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";

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

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [newContent, setNewContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const pageSize = 10;

    const organization = useAppSelector(
        (state: RootState) => state.organization
    );

    console.log("org", organization);
    useEffect(() => {
        loadNotifications(page);
        loadEmployees();
    }, [page]);

    const loadNotifications = (pageNumber: number) => {
        setLoading(true);
        api.get('/api/notification/notification-fetch', {
            params: { offset: (pageNumber - 1) * pageSize, limit: pageSize }
        })
            .then((res) => {
                setNotifications(res.data.notifications);
                setTotalPages(Math.ceil(res.data.total / pageSize));
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load notifications. Please try again later.');
                setLoading(false);
                console.log(err);
            });
    };

    const loadEmployees = () => {
        api.get('/api/notification/employees-fetch', {
            params: { org_abbreviation: organization.abbreviation }
        })
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => {
                setError('Failed to load employees.');
                console.log(err);
            });
    };

    const handleCreate = () => {
        if (!newContent.trim()) {
            setError('Notification content cannot be empty.');
            return;
        }
        if (!selectedEmployeeId) {
            setError('Please select an employee to send the notification to.');
            return;
        }

        api.post('/api/notification/notification-create', { content: newContent, receiver_id: selectedEmployeeId })
            .then((res) => {
                const newNotification = res.data;
                setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
                setNewContent('');
                setError(null);
            })
            .catch((err) => {
                setError('Failed to create notification.');
                console.log(err);
            });
    };

    const handlePageClick = (pageNumber: number) => {
        setPage(pageNumber);
    };

    return (
        <div className="notifications-page">
            <h2>Notifications</h2>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Create Notification */}
            <div className="create-notification">
                <textarea
                    placeholder="Enter new notification content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="notification-input"
                />
                
                <select 
                    onChange={(e) => setSelectedEmployeeId(Number(e.target.value))} 
                    value={selectedEmployeeId || ""}
                    className="employee-select"
                >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name}
                        </option>
                    ))}
                </select>

                <button onClick={handleCreate} className="btn-create">Create Notification</button>
            </div>

            {/* Loading Spinner */}
            {loading && <div className="spinner">Loading...</div>}

            {/* List of Notifications */}
            <ul className="notification-list">
                {notifications.map((notification) => (
                    <li key={notification.id} className="notification-item">
                        <p className="notification-content">{notification.content}</p>
                        <p className="notification-sender">Sent by: {notification.first_name} {notification.last_name}</p>
                        <small className="notification-date">{new Date(notification.created_date).toLocaleString()}</small>
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageClick(index + 1)}
                        className={`pagination-btn ${page === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage;
