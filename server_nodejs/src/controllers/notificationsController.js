const { log } = require("winston");
const db = require("../config/db");

exports.getNotifications = async (req, res) => {
    try {
        const { offset = 0, limit = 10 } = req.query;

        const result = await db.query(
            `SELECT u.last_name, u.first_name, u.avatar, n.id, n.content, n.created_date, n.sender_id
            FROM users u INNER JOIN employees e ON u.id = e.user_id 
                INNER JOIN notifications n ON e.id = n.sender_id
                INNER JOIN notification_receivers r ON n.id = r.notification_id
            WHERE r.receiver_id = $1
            ORDER BY created_date DESC
            LIMIT $2 OFFSET $3;`,
            [req.user.id, limit, offset]
        );
        const notifications = result.rows;
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
