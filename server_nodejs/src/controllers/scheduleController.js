const { log } = require("winston");
const db = require("../config/db");
const moment = require('moment');

exports.scheduleGet = async (req, res) => {
    try {
        const { org, date } = req.body;
        const formattedDate = moment(date).format('YYYY-MM-DD');
        console.log("AAAAAAAAAAAAA", formattedDate);

        const data = await db.query(
            `select u.id, u.first_name, u.last_name, e.id, s.start_time, s.end_time, o.name from employees as e
            inner join users as u on u.id = e.user_id
            inner join schedules as s on e.id = s.emp_id
            inner join organizations as o on o.abbreviation = e.org_abbreviation
            where e.org_abbreviation = $1 and Date(start_time) = $2 `,
            [org, formattedDate]
        );
        console.log("BBBBBBBBBBB", data.rows);

        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};