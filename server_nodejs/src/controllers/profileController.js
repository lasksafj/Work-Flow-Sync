const { log } = require("winston");
const db = require("../config/db");

exports.profileGet = async (req, res) => {
    console.log(req.user);
    try {
        const data = await db.query(
            `SELECT e.id, e.employee_number, e.pay_rate, e.role_name, e.user_id, e.org_abbreviation, o.name as org_name, r.description as role_description
             FROM employees e
             JOIN organizations o ON e.org_abbreviation = o.abbreviation
             JOIN roles r ON e.role_name = r.name
             WHERE e.user_id=$1 AND e.org_abbreviation=$2;`,
            [req.user.id, req.query.org]
        );
        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
