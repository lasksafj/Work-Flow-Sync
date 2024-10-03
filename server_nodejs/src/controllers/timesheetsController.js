const db = require("../config/db");

    exports.clockInOut = async (req, res) => {
        try {
            const user_id = req.user.id;
            const { org_abbreviation } = req.body;

            // Get the employee data for the logged-in user
            const empResult = await db.query(
                `SELECT e.id, o.name 
                FROM employees e INNER JOIN organizations o ON (e.org_abbreviation = o.abbreviation)
                WHERE user_id = $1 and org_abbreviation = $2`,
                [user_id, org_abbreviation]
            );

            const organizationName = empResult.rows[0].name;

            if (empResult.rowCount === 0) {
                return res.status(400).json({ error: 'You are not authorized for ', organizationName });
            }

            const employee = empResult.rows[0];
            const emp_id = employee.id;

            // Get org_abbreviation from req.body
            // const org_abbreviation_scanned = req.body.org_abbreviation;
            // console.log("org_abbreviation_scanned", org_abbreviation_scanned);
            // if (employee.org_abbreviation !== org_abbreviation_scanned) {
            //     return res.status(403).json({ error: 'You are not authorized for this organization.' });
            // }

            // Check if the employee is clocking in or out
            const existingTimesheet = await db.query(
                "SELECT * FROM timesheets WHERE emp_id = $1 AND clock_out IS NULL", 
                [emp_id]
            );

            if (existingTimesheet.rowCount > 0) {
                // Clocking out
                await db.query(
                    "UPDATE timesheets SET clock_out = $1 WHERE emp_id = $2 AND clock_out IS NULL", 
                    [new Date(), emp_id]
                );
                res.status(200).json({ message: "Clocked out successfully" });
            } else {
                // Clocking in
                await db.query(
                    "INSERT INTO timesheets (emp_id, clock_in) VALUES ($1, $2)", 
                    [emp_id, new Date()]
                );
                res.status(200).json({ message: "Clocked in successfully" });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };