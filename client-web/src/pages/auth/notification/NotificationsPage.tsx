import api from "../../../apis/api";
import React, { useState, useEffect } from 'react';
import OrganizationList from './OrganizationList';
import OrganizationDetails from './OrganizationDetails'; // Import the new component
import NotificationList from './NotificationList';
import CreateNotification from './CreateNotification';

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

interface Organization {
    abbreviation: string;
    name: string;
    address: string;
    start_date: string;
}

interface OrganizationDetailsType {
    organization: Organization;
    employeeCount: number;
    roleCount: number;
    shiftCount: number;
    roles: {
        name: string;
        description: string;
    }[];
    recentNotifications: {
        id: number;
        content: string;
        created_date: string;
    }[];
}

const NotificationsPage: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [organizationDetails, setOrganizationDetails] = useState<OrganizationDetailsType | null>(null);
    const [loadingOrganizations, setLoadingOrganizations] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeId, setEmployeeId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = () => {
        setLoadingOrganizations(true);
        api.get('/api/notification/organizations-fetch')
            .then((res) => {
                setOrganizations(res.data);
                setLoadingOrganizations(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message);
                setLoadingOrganizations(false);
            });
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

    const fetchOrganizationDetails = (orgAbbreviation: string) => {
        api.get('/api/notification/organization-details-fetch', {
            params: { org: orgAbbreviation }
        })
            .then((res) => {
                setOrganizationDetails(res.data);
            })
            .catch((err) => {
                setError('Failed to fetch organization details.');
                console.log(err);
            });
    };

    const loadNotifications = (pageNumber: number, orgAbbreviation: string | null, empId: number | null) => {
        if (!orgAbbreviation || !empId) {
            setError("Please select an organization and ensure your employee ID is available.");
            return;
        }

        api.get("/api/notification/notifications-fetch", {
            params: {
                offset: (pageNumber - 1) * pageSize,
                limit: pageSize,
                org: orgAbbreviation,
                employeeId: empId
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

    const handleSelectOrganization = (organization: Organization) => {
        setSelectedOrganization(organization);
        setPage(1); // Reset pagination to the first page

        if (organization.abbreviation) {
            fetchOrganizationDetails(organization.abbreviation);
            fetchEmployees(organization.abbreviation);
            api.get("/api/notification/employee-id-fetch", {
                params: { org: organization.abbreviation }
            })
                .then((res) => {
                    setEmployeeId(res.data.employeeId);
                    loadNotifications(1, organization.abbreviation, res.data.employeeId);
                })
                .catch((err) => {
                    setError("Failed to fetch employee ID or load notifications.");
                    console.log(err);
                });
        } else {
            setError("Failed to load employees or notifications. Please try again later.");
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
        if (selectedOrganization && employeeId) {
            loadNotifications(pageNumber, selectedOrganization.abbreviation, employeeId);
        }
    };

    const handleCreateNotification = (content: string, selectedEmployeeIds: number[]) => {
        if (!employeeId) {
            setError('Your employee ID is not available.');
            return;
        }

        api.post('/api/notification/notification-create', {
            content,
            receiver_ids: selectedEmployeeIds,
            sender_id: employeeId,
        })
            .then((res) => {
                const newNotification = res.data;
                setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
                setError(null);
            })
            .catch((err) => {
                setError('Failed to create notification.');
                console.log(err);
            });
    };

    return (
        <div className="container py-4">
            <div className="row">
                {/* Organization Selector */}
                <OrganizationList
                    organizations={organizations}
                    selectedOrganization={selectedOrganization}
                    onSelectOrganization={handleSelectOrganization}
                    loading={loadingOrganizations}
                />

                {/* Content Section */}
                <div className="col-md-8">
                    {!selectedOrganization ? (
                        <div className="card">
                            <div className="card-body text-center">
                                <h5 className="text-muted">
                                    Please select an organization to view and create notifications.
                                </h5>
                                <p className="text-muted">Click on an organization from the list to proceed.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Organization Details */}
                            {organizationDetails && (
                                <OrganizationDetails
                                    organization={organizationDetails.organization}
                                    employeeCount={organizationDetails.employeeCount}
                                    roles={organizationDetails.roles}
                                />
                            )}

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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
