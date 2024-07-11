// const userService = require('../services/userService');

exports.earnings = async (req, res) => {
    try {
        data = [
            {
                workHours: 75,
                date: "Jun 15 - Jun 30",
                payment: 2341.64,
            },
            {
                workHours: 45,
                date: "Jun 1 - Jun 15",
                payment: 1234,
            },
            {
                workHours: 75,
                date: "Jun 15 - Jun 30",
                payment: 2341.64,
            },
            {
                workHours: 45,
                date: "Jun 1 - Jun 15",
                payment: 1234,
            },
            {
                workHours: 75,
                date: "Jun 15 - Jun 30",
                payment: 2341.64,
            },
            {
                workHours: 45,
                date: "Jun 1 - Jun 15",
                payment: 1234,
            },
        ]
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};