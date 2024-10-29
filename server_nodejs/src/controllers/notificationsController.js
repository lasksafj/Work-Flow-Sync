const { log } = require("winston");
const db = require("../config/db");

// Controller to handle getting notifications for a specific user
exports.getNotifications = async (req, res) => {
    try {
        // Retrieve offset and limit from query parameters with default values
        const { offset = 0, limit = 10 } = req.query;

        // Query to get notifications for the user, joining multiple tables (users, employees, notifications, and notification_receivers)
        const result = await db.query(
            `SELECT u.last_name, u.first_name, u.avatar, n.id, n.content, n.created_date, n.sender_id
            FROM users u INNER JOIN employees e ON u.id = e.user_id 
                INNER JOIN notifications n ON e.id = n.sender_id
                INNER JOIN notification_receivers r ON n.id = r.notification_id
            WHERE r.receiver_id = $1
            ORDER BY created_date DESC
            LIMIT $2 OFFSET $3;`,
            [req.user.id, limit, offset] // Bind user's id, limit, and offset to the query
        );

        // Retrieve rows (notifications) from the result
        const notifications = result.rows;
        res.status(200).json(notifications); // Return notifications in the response
    } catch (error) {
        // Handle any errors and return a 400 status with the error message
        res.status(400).json({ error: error.message });
    }
};
