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
        // console.log("SVSVE", data.rows[0].org_abbreviation);

        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDropShifts = async (req, res) => {
    try {
        let org = req.query.org;

        const data = await db.query(
            `SELECT u.first_name || ' ' || u.last_name AS fullname, r.schedules_id, r.id,
                u.avatar, s.start_time, s.end_time, r.reason, r.status, r.request_time
                FROM request r
                INNER JOIN employees e ON r.employee_id = e.id
                INNER JOIN users u ON e.user_id = u.id
                INNER JOIN schedules s ON s.id = r.schedules_id
                WHERE r.status = 'Pending' AND e.org_abbreviation = $1
            EXCEPT
            SELECT u.first_name || ' ' || u.last_name AS fullname, r.schedules_id, r.id,
                u.avatar, s.start_time, s.end_time, r.reason, r.status, r.request_time
                FROM request r
				INNER JOIN exchange ex ON ex.request_id = r.id
                INNER JOIN employees e ON r.employee_id = e.id
                INNER JOIN users u ON e.user_id = u.id
                INNER JOIN schedules s ON s.id = r.schedules_id
                WHERE r.status = 'Pending' AND e.org_abbreviation = $1`,
            [org]
        );
        // console.log(data.rows[0]);
        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSwapShifts = async (req, res) => {
    try {
        let org = req.query.org;

        const data = await db.query(
            `SELECT 
                u1.first_name || ' ' || u1.last_name AS fullname1, r1.schedules_id AS scheduleid1, r1.id,
                e1.id AS empid1, u1.avatar, s1.start_time, s1.end_time, r1.reason, r1.status, r1.request_time,
                u2.first_name || ' ' || u2.last_name AS fullname2, ex.schedules_id AS scheduleid2,
                e2.id AS empid2, u1.avatar, s2.start_time AS starttime, s2.end_time AS endtime
            FROM exchange ex
            INNER JOIN request r1 ON ex.request_id = r1.id
            INNER JOIN employees e1 ON r1.employee_id = e1.id
            INNER JOIN users u1 ON e1.user_id = u1.id
            INNER JOIN schedules s1 ON s1.id = r1.schedules_id
            INNER JOIN employees e2 ON ex.employee_id  = e2.id
            INNER JOIN users u2 ON e2.user_id = u2.id
            INNER JOIN schedules s2 ON ex.schedules_id = s2.id
            WHERE r1.status = 'Pending' AND e1.org_abbreviation = $1`,
            [org]
        );
        // console.log(data.rows[0]);
        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateDropShifts = async (req, res) => {
    try {
        let { requestId, scheduleId, dropStatus } = req.body;
        userId = req.user.id;

        await db.query(
            `UPDATE request
             SET status=$1, manager_id=$2, approved_time=NOW()
             WHERE id=$3`,
            [dropStatus, userId, requestId]
        );
        // console.log("AAAAA", swapStatus);
        // console.log("BBBB", scheduleId);

        if (dropStatus === 'Accept') {
            await db.query(
                `DELETE FROM schedules
                     WHERE id=$1`,
                [scheduleId]
            );
        }
        res.status(200).json({ message: `Request ${dropStatus} successfully!` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateSwapShifts = async (req, res) => {
    try {
        let { requestId, swapStatus, scheduleId1, scheduleId2, empid1, empid2 } = req.body;
        userId = req.user.id;

        await db.query(
            `UPDATE request
             SET status=$1, manager_id=$2, approved_time=NOW()
             WHERE id=$3`,
            [swapStatus, userId, requestId]
        );
        console.log("AAAAA", scheduleId1);
        console.log("BBBB", scheduleId2);
        console.log("CCCCC", empid1);
        console.log("DDDD", empid2);



        if (swapStatus === 'Accept') {
            await db.query(
                `UPDATE schedules
                SET emp_id = $2
                WHERE id = $1;`,
                [scheduleId1, empid2]
            );
            await db.query(
                `UPDATE schedules
                SET emp_id = $2
                WHERE id = $1;`,
                [scheduleId2, empid1]
            );
        }
        res.status(200).json({ message: `Request ${swapStatus} successfully!` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


