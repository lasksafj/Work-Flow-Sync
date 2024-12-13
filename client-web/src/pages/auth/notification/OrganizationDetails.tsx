interface Role {
    name: string;
    description: string;
}

interface OrganizationDetailsProps {
    organization: {
        abbreviation: string;
        name: string;
        address: string;
        start_date: string;
    };
    employeeCount: number;
    roles: Role[];
}

const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({
    organization,
    employeeCount,
    roles,
}) => {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">{organization.name}</h3>
                <p className="card-text">
                    <strong>Address:</strong> {organization.address}
                </p>
                <p className="card-text">
                    <strong>Founded on:</strong>{' '}
                    {new Date(organization.start_date).toLocaleDateString()}
                </p>
                <p className="card-text">
                    <strong>Total Employees:</strong> {employeeCount}
                </p>
                {/* Display roles */}
                <h5 className="mt-4">Roles</h5>
                <ul className="list-group">
                    {roles.map((role) => (
                        <li key={role.name} className="list-group-item">
                            <strong>{role.name}</strong>: {role.description}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrganizationDetails;
