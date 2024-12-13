import React from 'react';

interface Organization {
    abbreviation: string;
    name: string;
    address: string;
    start_date: string;
}

interface OrganizationListProps {
    organizations: Organization[];
    selectedOrganization: Organization | null;
    onSelectOrganization: (organization: Organization) => void;
    loading: boolean;
}

const OrganizationList: React.FC<OrganizationListProps> = ({
    organizations,
    selectedOrganization,
    onSelectOrganization,
    loading,
}) => {
    return (
        <div className="col-md-4">
            <h4>Organizations</h4>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="list-group">
                    {organizations.map((org) => (
                        <button
                            key={org.abbreviation}
                            type="button"
                            className={`list-group-item list-group-item-action ${selectedOrganization?.abbreviation === org.abbreviation ? 'active' : ''
                                }`}
                            onClick={() => onSelectOrganization(org)}
                        >
                            <h5 className="mb-1">{org.name}</h5>
                            <p className="mb-1">{org.address}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrganizationList;