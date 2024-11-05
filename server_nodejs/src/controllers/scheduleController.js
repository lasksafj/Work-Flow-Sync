const { log } = require("winston");
const db = require("../config/db");
const moment = require('moment');

exports.scheduleGet = async (req, res) => {
    try {
        let org = req.query.org;
        let chosedate = req.query.chosedate;

        const formattedDate = moment(chosedate).format('YYYY-MM-DD');

        const data = await db.query(
            `select u.id, u.first_name, u.last_name, e.id, s.start_time, s.end_time, o.name, u.avatar from employees as e
            inner join users as u on u.id = e.user_id
            inner join schedules as s on e.id = s.emp_id
            inner join organizations as o on o.abbreviation = e.org_abbreviation
            where e.org_abbreviation = $1 and Date(start_time) = $2
            order by start_time `,
            [org, formattedDate]
        );

        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};