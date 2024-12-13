const { error } = require("winston");
const db = require("../config/db");

/**
 * Controller function to create a drop shift request.
 * This function handles the creation of a request to drop a scheduled shift.
 * It ensures that the user provides a reason for the drop and that no existing request
 * for the same shift already exists.
 */
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
