const db = require("../config/db");

// Function to fetch organization details based on the logged-in user
exports.fetchOrganizations = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the request, assuming the user is authenticated
        const result = await db.query(
            `SELECT o.abbreviation, o.name, o.address
            FROM users u 
            INNER JOIN employees e ON u.id = e.user_id
            INNER JOIN organizations o ON e.org_abbreviation = o.abbreviation
            WHERE u.id = $1`, // Query to fetch organization details for the logged-in user
            [userId]
        );

        res.status(200).json(result.rows); // Send the organization details back to the client
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error response if query fails
    }
};

exports.fetchOrganizationDetails = async (req, res) => {
    try {
        const orgAbbreviation = req.query.org;

        // Get organization details
        const orgResult = await db.query(
            `SELECT abbreviation, name, address, start_date
            FROM organizations
            WHERE abbreviation = $1`,
            [orgAbbreviation]
        );

        if (orgResult.rows.length === 0) {
            return res.status(404).json({ error: "Organization not found." });
        }

        const organization = orgResult.rows[0];

        // Get counts
        const employeeCountResult = await db.query(
            `SELECT COUNT(*) AS employee_count
            FROM employees
            WHERE org_abbreviation = $1`,
            [orgAbbreviation]
        );

        const roleCountResult = await db.query(
            `SELECT COUNT(*) AS role_count
            FROM roles
            WHERE org_abbreviation = $1`,
            [orgAbbreviation]
        );

        // Get roles
        const rolesResult = await db.query(
            `SELECT name, description
            FROM roles
            WHERE org_abbreviation = $1`,
            [orgAbbreviation]
        );

        res.status(200).json({
            organization,
            employeeCount: parseInt(employeeCountResult.rows[0].employee_count),
            roleCount: parseInt(roleCountResult.rows[0].role_count),
            roles: rolesResult.rows,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.fetchEmployees = async (req, res) => {
    try {
        const orgAbbreviation = req.query.org;
        const employeesResult = await db.query(
            `SELECT e.id AS id, u.email, u.last_name, u.first_name, u.phone_number,
                u.date_of_birth, u.avatar, e.role_name
            FROM users u 
            INNER JOIN employees e ON e.user_id = u.id
            INNER JOIN organizations o ON o.abbreviation = e.org_abbreviation
            WHERE o.abbreviation = $1`,
            [orgAbbreviation]
        );

        res.status(200).json(employeesResult.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.fetchEmployeeId = async (req, res) => {
    try {
        const userId = req.user.id;
        const orgAbbreviation = req.query.org;

        const result = await db.query(
            `SELECT id 
            FROM employees 
            WHERE user_id = $1 AND org_abbreviation = $2`,
            [userId, orgAbbreviation]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Employee ID not found for this organization." });
        }
        console.log("result.rows[0].id", result.rows[0].id);
        res.status(200).json({ employeeId: result.rows[0].id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.fetchNotifications = async (req, res) => {
    try {
        const offset = parseInt(req.query.offset, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 10;
        const orgAbbreviation = req.query.org;

        if (!orgAbbreviation) {
            return res.status(400).json({ error: "Organization abbreviation is required." });
        }

        // Fetch notifications for the logged-in employee
        const notificationsResult = await db.query(
            `SELECT u.last_name, u.first_name, u.avatar, n.id, n.content, n.created_date, n.sender_id
            FROM notifications n
            INNER JOIN employees e ON n.sender_id = e.id
            INNER JOIN users u ON e.user_id = u.id
            WHERE e.org_abbreviation = $1
            ORDER BY n.created_date DESC
            LIMIT $2 OFFSET $3;`,
            [orgAbbreviation, limit, offset]
        );

        // Fetch the count of notifications
        const countResult = await db.query(
            `SELECT COUNT(*) AS total
            FROM notifications n
            INNER JOIN employees e ON n.sender_id = e.id
            WHERE e.org_abbreviation = $1;`,
            [orgAbbreviation]
        );

        res.status(200).json({
            notifications: notificationsResult.rows,
            total: countResult.rows[0].total
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.createNotification = async (req, res) => {
    const { content, receiver_ids, sender_id } = req.body;
    try {
        await db.query('BEGIN');

        const notificationRes = await db.query(
            `INSERT INTO notifications (content, created_date, sender_id, is_read)
            VALUES ($1, NOW(), $2, FALSE)
            RETURNING *`,
            [content, sender_id]
        );

        const notification = notificationRes.rows[0];

        const senderResult = await db.query(
            `SELECT first_name, last_name FROM users WHERE id = $1`,
            [req.user.id]
        );
        const sender = senderResult.rows[0];

        const values = receiver_ids.map(receiverId => `(${notification.id}, ${receiverId})`).join(',');
        await db.query(`INSERT INTO notification_receivers (notification_id, receiver_id) VALUES ${values};`);

        await db.query('COMMIT');

        res.status(200).json({
            ...notification,
            first_name: sender.first_name,
            last_name: sender.last_name
        });
    } catch (error) {
        await db.query('ROLLBACK');
        res.status(400).json({ error: error.message });
    }
};

