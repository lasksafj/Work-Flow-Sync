const { log } = require("winston");
const db = require("../config/db");

exports.fetchNotifications = async (req, res) => {
    try {
        const offset = parseInt(req.query.offset, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 10;

        const notificationsResult = await db.query(
            `SELECT u.last_name, u.first_name, n.id, n.content, n.created_date, n.sender_id
            FROM users u INNER JOIN employees e ON u.id = e.user_id 
                INNER JOIN notifications n ON e.id = n.sender_id
                INNER JOIN notification_receivers r ON n.id = r.notification_id
            ORDER BY created_date DESC
            LIMIT $1 OFFSET $2;`,
            [limit, offset]
        );

        const countResult = await db.query(
            `SELECT COUNT(*) FROM notifications;`
        );

        res.status(200).json({
            notifications: notificationsResult.rows,
            total: parseInt(countResult.rows[0].count, 10)
        }); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

exports.fetchEmployeesByOrg = async (req, res) => {
    try {
        const orgAbbreviation = req.org_abbreviation;
        console.log("------------", orgAbbreviation);
        const employeesResult = await db.query(
            `SELECT u.id, first_name, last_name 
            FROM employees e INNER JOIN users u ON e.user_id = u.id
            WHERE e.org_abbreviation = $1`,
            [orgAbbreviation]
        );
        console.log("------------", employeesResult.rows);
        res.status(200).json(employeesResult.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createNotification = async (req, res) => {
    const { content, receiver_id } = req.body;
    try {
        await db.query('BEGIN');
        const notificationRes = await db.query(
            `INSERT INTO notifications (content, created_date, sender_id, is_read)
            VALUES ($1, NOW(), $2, FALSE)
            RETURNING *`,
            [content, req.user.id]
        );

        const notification = notificationRes.rows[0];

        const senderResult = await db.query(
            `SELECT first_name, last_name FROM users WHERE id = $1`,
            [req.user.id]
        );
        const sender = senderResult.rows[0];

        // Insert selected receiver ID
        await db.query(
            `INSERT INTO notification_receivers (notification_id, receiver_id)
            VALUES ($1, $2);`,
            [notification.id, receiver_id]
        );

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

