const { log } = require("winston");
const db = require("../config/db");

// Fetch organizations associated with the user
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

        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Fetch pending drop shift requests for a specific organization
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

        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Fetch pending swap shift requests for a specific organization
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

        res.status(200).json(data.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update the status of a drop shift request
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

        // If the request is accepted, delete the corresponding schedule
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

//Update the status of a swap shift request
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

        // If the request is accepted, swap the employees assigned to the schedules
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

exports.createDropRequest = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const { schedule_id, status, reason, abbreviation } = req.body;

        // Extract the user ID from the authenticated request
        const userId = req.user.id;

        // Validate that a reason is provided
        if (!reason) {
            return res.status(400).json({ error: "Reason is required!" });
        }

        console.log(userId, abbreviation);

        // Query the database to get the employee ID associated with the user and organization abbreviation
        const employeeID = await db.query(
            `SELECT e.id
                FROM employees e
                JOIN users u ON e.user_id = u.id
                WHERE u.id = $1
                AND e.org_abbreviation = $2;`,
            [userId, abbreviation]
        );

        // Check if the employee exists
        if (employeeID.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found." });
        }

        // Query the database to check if a drop request for this shift already exists
        const existingRequest = await db.query(
            `SELECT *
                FROM request
                WHERE employee_id = $1
                AND schedules_id = $2`,
            [employeeID.rows[0].id, schedule_id]
        );

        // If an existing request is found, return an error
        if (existingRequest.rows.length > 0) {
            return res.status(400).json({ error: "Request from this shift already exists." });
        }

        // Insert a new drop request into the 'request' table
        const result = await db.query(
            `INSERT INTO request (
                schedules_id,
                status,
                reason,
                request_time,
                employee_id
                )
                VALUES ($1, $2, $3, NOW(), $4) RETURNING *`,
            [schedule_id, status, reason, employeeID.rows[0].id]
        );

        // Extract the inserted request data
        const confrimNotification = result.rows[0];

        // Respond with the newly created request data
        res.status(201).json(confrimNotification);

    } catch (error) {
        // Log the error and respond with a 400 status and error message
        res.status(400).json({ error: error.message });
    }
};

/**
 * Controller function to get details of employees available on a specific date.
 * This function retrieves a list of employees who are scheduled to work on a given date
 * excluding the requesting employee.
 */
exports.getDateDetails = async (req, res) => {
    try {
        // Destructure required query parameters
        const { abbreviation, date, employee_number } = req.query;

        console.log('abbre: ', abbreviation, 'date', date);

        // Validate that all required query parameters are provided
        if (!abbreviation || !date || !employee_number) {
            return res.status(400).json({ error: "Abbreviation, date, and employee_number are required!" });
        }

        // Query the database to retrieve employee details for the specified date
        const data = await db.query(
            `SELECT
                e.employee_number,
                e.id,
                u.last_name,
                u.first_name,
                s.start_time,
                s.end_time,
                s.role AS schedule_role,
                o.name AS organization_name
            FROM employees AS e
            INNER JOIN schedules AS s ON e.id = s.emp_id
            INNER JOIN organizations AS o ON o.abbreviation = e.org_abbreviation
            INNER JOIN users AS u ON e.user_id = u.id
            WHERE o.abbreviation = $1
            AND s.start_time::date = $2
            AND e.employee_number != $3`,
            [abbreviation, date, employee_number]
        );

        // Respond with the retrieved employee data
        res.status(200).json(data.rows);
    } catch (error) {
        // Log the error and respond with a 400 status and error message
        res.status(400).json({ error: error.message });
    }
};

/**
 * Controller function to create a swap shift request.
 * This function handles the creation of a request to swap a scheduled shift with another employee.
 * It ensures that the user provides a reason for the swap and that no existing request
 * for the same shift already exists. Additionally, it records the exchange details in the 'exchange' table.
 */
exports.createSwapRequest = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const { schedule_id, status, reason, abbreviation, swapEmployeeId } = req.body;

        console.log('send to swap:', schedule_id, status, reason, abbreviation, swapEmployeeId);

        // Extract the user ID from the authenticated request
        const userId = req.user.id;

        // Validate that a reason is provided
        if (!reason) {
            return res.status(400).json({ error: "Reason is required!" });
        }

        // Query the database to get the employee ID associated with the user and organization abbreviation
        const employeeID = await db.query(
            `SELECT e.id
                FROM employees e
                JOIN users u ON e.user_id = u.id
                WHERE u.id = $1
                AND e.org_abbreviation = $2;`,
            [userId, abbreviation]
        );

        // Check if the employee exists
        if (employeeID.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found." });
        }

        // Query the database to check if a swap request for this shift already exists
        const existingRequest = await db.query(
            `SELECT *
                FROM request
                WHERE employee_id = $1
                AND schedules_id = $2`,
            [employeeID.rows[0].id, schedule_id]
        );

        // If an existing request is found, return an error
        if (existingRequest.rows.length > 0) {
            return res.status(400).json({ error: "Request from this shift already exists." });
        }

        // Insert a new swap request into the 'request' table
        const result = await db.query(
            `INSERT INTO request (
                schedules_id,
                status,
                reason,
                request_time,
                employee_id
                )
                VALUES ($1, $2, $3, NOW(), $4) RETURNING *`,
            [schedule_id, status, reason, employeeID.rows[0].id]
        );

        // Retrieve the ID of the newly created swap request
        const requestID = await db.query(
            `SELECT id
                FROM request
                WHERE schedules_id = $1
                AND employee_id = $2`,
            [schedule_id, employeeID.rows[0].id]
        );

        console.log(requestID);

        // Insert a new exchange record linking the swap request to the selected employee
        const resultSwap = await db.query(
            `INSERT INTO exchange (
                request_id,
                schedules_id,
                employee_id
                )
                VALUES ($1, $2, $3) RETURNING *`,
            [requestID.rows[0].id, schedule_id, swapEmployeeId]
        );

        // Combine the request and exchange data for confirmation
        const confrimNotification = {
            request: result.rows[0],
            swap: resultSwap.rows[0]
        };

        console.log(confrimNotification);

        // Respond with the confirmation data
        res.status(201).json(confrimNotification);

    } catch (error) {
        // Log the error and respond with a 400 status and error message
        res.status(400).json({ error: error.message });
    }
};
