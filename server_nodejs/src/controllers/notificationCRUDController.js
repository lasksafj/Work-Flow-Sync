const { log } = require("winston");
const db = require("../config/db");

exports.fetchNotifications = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM public.notifications ORDER BY id ASC`
        );
        const notifications = result.rows;
        res.status(200).json(notifications); // Return notifications in the response
    } catch (error) {
        // Handle any errors and return a 400 status with the error message
        res.status(400).json({ error: error.message });
    }

};

// export const createNotification = async (notification: Omit<Notification, 'id'>) => {
//     const response = await axios.post(API_URL, notification);
//     return response.data;
// };

// export const updateNotification = async (id: number, updatedNotification: Partial<Notification>) => {
//     const response = await axios.put(`${API_URL}/${id}`, updatedNotification);
//     return response.data;
// };

// export const deleteNotification = async (id: number) => {
//     const response = await axios.delete(`${API_URL}/${id}`);
//     return response.data;
// };