const db = require("../config/db");

exports.getExample = async (req, res) => {
    try {
        const userId = req.user.id;
        // Get
        const { num1, num2 } = req.query;
        // Post, put
        // const { num1, num2 } = req.body;
        // database....
        let result = parseInt(num1) + parseInt(num2);
        res.status(200).json({ num: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDetailShift = async (req, res) => {
    try {
        const { orgAbbr } = req.query;
        console.log(orgAbbr);
        const result = await db.query(
            `SELECT s.start_time, s.end_time, e.role_name, o.name
            FROM users u inner join employees e on u.id = e.user_id inner join organizations o
            on o.abbreviation = e.org_abbreviation inner join schedules s on s.emp_id = e.id 
            WHERE u.id = $1 AND o.abbreviation = $2
            ORDER by start_time desc limit 7`,
            [req.user.id, orgAbbr]
        );

        const data = result.rows;
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
