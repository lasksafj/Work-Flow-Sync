const db = require("../config/db");

// Controller function to get the clock-in status of an employee
exports.getClockStatus = async (req, res) => {
    try {
        
        const user_id = req.user.id; // Extract the user ID from the request object (populated by the authentication middleware)
        const { org_abbreviation } = req.query; // Extract the organization abbreviation from the query parameters

        // Validate that the organization abbreviation is provided
        if (!org_abbreviation) {
            return res.status(400).json({ error: "Organization code is required" });
        }

        // Get the employee ID and organization name
        const empResult = await db.query(
            `SELECT e.id AS emp_id, o.name AS org_name
            FROM employees e
            INNER JOIN organizations o ON e.org_abbreviation = o.abbreviation
            WHERE e.user_id = $1 AND e.org_abbreviation = $2`,
            [user_id, org_abbreviation]
        );

        // Check if the employee exists in the specified organization
        if (empResult.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found in the specified organization" });
        }

        const emp_id = empResult.rows[0].emp_id;
        const org_name = empResult.rows[0].org_name;

        // Check if the employee is currently clocked in
        const timesheetResult = await db.query(
            "SELECT * FROM timesheets WHERE emp_id = $1 AND clock_out IS NULL",
            [emp_id]
        );

        const isClockedIn = timesheetResult.rowCount > 0;

        return res.status(200).json({ clockedIn: isClockedIn, org_name });
    } catch (error) {
        console.error("Error in getClockStatus:", error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

// Controller function to handle clock-in and clock-out actions
exports.clockInOut = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { org_abbreviation } = req.body;

        // Validate that the organization abbreviation is provided
        if (!org_abbreviation) {
            return res.status(400).json({ error: "Organization code is required" });
        }

        // Query to get the employee data for the logged-in user in the specified organization
        const empResult = await db.query(
            `SELECT e.id AS emp_id, o.name AS org_name
            FROM employees e
            INNER JOIN organizations o ON e.org_abbreviation = o.abbreviation
            WHERE e.user_id = $1 AND e.org_abbreviation = $2`,
            [user_id, org_abbreviation]
        );

        // Check if the employee exists in the specified organization
        if (empResult.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found in the specified organization" });
        }

        const emp_id = empResult.rows[0].emp_id;
        const org_name = empResult.rows[0].org_name;

        // Check if the employee has an existing timesheet entry without a clock_out time (currently clocked in)
        const timesheetResult = await db.query(
            "SELECT * FROM timesheets WHERE emp_id = $1 AND clock_out IS NULL", 
            [emp_id]
        );

        if (timesheetResult.rowCount > 0) {
            // Employee is clocking out

            // Update the existing timesheet with the current clock_out time
            await db.query(
                "UPDATE timesheets SET clock_out = NOW() WHERE emp_id = $1 AND clock_out IS NULL",
                [emp_id]
            );

            return res.status(200).json({ message: `Clock-out successful! \nGoodbye from ${org_name}. \nEnjoy the rest of your day.` });
        } else {
            // Employee is clocking in

            // Insert a new timesheet entry with the current clock_in time
            await db.query(
                "INSERT INTO timesheets (emp_id, clock_in) VALUES ($1, NOW())",
                [emp_id]
            );

            return res.status(200).json({ message: `Clock-in successful! \nWelcome to ${org_name}. \nHave a great day at work.` });
        }
    } catch (error) {
        console.error("Error in clockInOut:", error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};