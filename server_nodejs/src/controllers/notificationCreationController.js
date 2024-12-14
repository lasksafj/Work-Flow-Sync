const db = require("../config/db");


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
    const { content, receiver_ids, org_abbr } = req.body;
    try {
        await db.query('BEGIN');
        
        let sender_id = await db.query(
            `SELECT id FROM employees WHERE user_id = $1 AND org_abbreviation = $2`, 
            [req.user.id, org_abbr]
        );
        sender_id = sender_id.rows[0].id;
        
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

