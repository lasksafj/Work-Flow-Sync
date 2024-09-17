const { log } = require("winston");
const db = require("../config/db");

exports.profileGetRole = async (req, res) => {
    console.log(req.user);
    try {
        const data = await db.query(
            `SELECT e.role_name as role
             FROM employees e
             WHERE e.user_id=$1 AND e.org_abbreviation=$2;`,
            [req.user.id, req.query.org]
        );
        res.status(200).json(data.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profileGetOrg = async (req, res) => {
    console.log(req.user);
    try {
        const data = await db.query(
            `select e.id as id, o.abbreviation as abbreviation, o.name as name, o.address as address
            from employees e
            join organizations o ON e.org_abbreviation = o.abbreviation
            where e.user_id=$1;`,
            [req.user.id]
        );
        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profileGetAllUsers = async (req, res) => {
    try {
        const data = await db.query(
            `SELECT u.email, u.first_name, u.last_name, u.avatar
            FROM employees e
            INNER JOIN users u ON u.id = e.user_id 
            WHERE e.org_abbreviation = $1
            GROUP BY u.email, u.first_name, u.last_name, u.avatar
            ORDER BY u.first_name;`,
            [req.query.org]
        );
        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profilePut = async (req, res) => {
    try {
        let { firstName, lastName, email, phoneNumber, dateOfBirth } = req.body;
        const data = await db.query(
            `UPDATE users
             SET last_name=$1, first_name=$2, email=$3, phone_number=$4, date_of_birth=$5
             WHERE id=$6`,
            [lastName, firstName, email, phoneNumber, dateOfBirth, req.user.id]
        );
        //lay nguoc du lieu tu db
        const result = await db.query("SELECT * FROM users WHERE id = $1", [
            req.user.id,
        ]);
        const user = result.rows[0];
        if (!user) throw new Error("Invalid access token");

        const profile = {
            email: user.email,
            lastName: user.last_name,
            firstName: user.first_name,
            phoneNumber: user.phone_number,
            dateOfBirth: user.date_of_birth,
        };
        console.log(profile);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};