const { log } = require("winston");
const db = require("../config/db");

exports.getOrg = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await db.query(
            `SELECT DISTINCT e.org_abbreviation as abbreviation, o.name
                FROM employees e
                INNER JOIN users u ON e.user_id = u.id
                INNER JOIN roles ro USING(org_abbreviation)
                INNER JOIN organizations o ON o.abbreviation = ro.org_abbreviation
                WHERE u.id = $1`,
            [userId]
        );
        console.log("SVSVE", data.rows[0].org_abbreviation);

        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        let org = req.query.org;
        // console.log("AAAAA", org);

        const data = await db.query(
            `SELECT u.first_name || ' ' || u.last_name AS fullname, u.avatar, s.start_time, s.end_time, r.reason, r.status, r.request_time
                FROM request r
                INNER JOIN employees e ON r.employee_id = e.id
                INNER JOIN users u ON e.user_id = u.id
                INNER JOIN schedules s ON s.id = r.schedules_id
                WHERE r.status = 'Pending' AND e.org_abbreviation = $1
                ORDER BY u.first_name;`,
            [org]
        );
        console.log(data.rows[0]);
        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};