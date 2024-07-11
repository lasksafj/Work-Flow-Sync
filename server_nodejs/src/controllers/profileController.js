const { log } = require("winston");
const db = require("../config/db");

exports.profileGet = async (req, res) => {
    console.log(req.user);
    try {
        const data = await db.query(
            `SELECT e.role_name as role, o.name as orgname, o.address as address
             FROM employees e
             JOIN organizations o ON e.org_abbreviation = o.abbreviation
             JOIN roles r ON e.role_name = r.name
             WHERE e.user_id=$1 AND e.org_abbreviation=$2;`,
            [req.user.id, req.query.org]
        );
        res.status(200).json(data.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
