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
            `SELECT 
                s.start_time, 
                s.end_time, 
                e.role_name, 
                o.name as organization_name
            FROM 
                schedules s
            JOIN 
                employees e ON s.emp_id = e.id
            JOIN 
                users u ON e.user_id = u.id
            JOIN 
                organizations o ON e.org_abbreviation = o.abbreviation
            WHERE 
                u.id = $1 
                AND o.abbreviation = $2;
`,
            [req.user.id, orgAbbr]
        );

        const data = result.rows;
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
