interface Notification {
    id: number;
    content: string;
    created_date: string;
    last_name: string;
    first_name: string;
}

interface NotificationListProps {
    notifications: Notification[];
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    currentPage: number;
}

const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    totalPages,
    onPageChange,
    currentPage,
}) => {
    const handlePageClick = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
        onPageChange(pageNumber);
    };

    return (
        <div>
            <ul className="list-group">
                {notifications.map((note) => (
                    <li key={note.id} className="list-group-item">
                        <div className="d-flex align-items-start">
                            <div>
                                <p className="mb-1">{note.content}</p>
                                <small className="text-muted">
                                    Sent by: {note.first_name} {note.last_name} on{' '}
                                    {new Date(note.created_date).toLocaleString()}
                                </small>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>


            {/* Pagination */}
            <nav className="mt-3">
                <ul className="pagination">
                    {/* Previous button */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </li>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => (
                        <li
                            key={pageNumber}
                            className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handlePageClick(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    ))}

                    {/* Next button */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default NotificationList;
