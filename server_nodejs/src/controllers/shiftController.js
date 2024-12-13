const db = require("../config/db");

// Controller function to get the clock-in status of an employee
exports.getEmployees = async (req, res) => {
    // Get employees with availability for a specific organization
    try {
        const orgAbbrev = req.query.org_abbreviation;
        if (!orgAbbrev) {
            return res.status(400).send('org_abbreviation is required');
        }

        // Fetch employees and join with users to get contact info
        const employeesResult = await db.query(
            `
        SELECT
          e.id AS employee_id,
          u.phone_number,
          u.email,
          u.first_name || ' ' || u.last_name AS name,
          e.role_name AS role
        FROM employees e
        JOIN users u ON e.user_id = u.id
        WHERE e.org_abbreviation = $1
        `,
            [orgAbbrev]
        );

        const employees = employeesResult.rows;

        // Get availability for these employees
        const employeeIds = employees.map((emp) => emp.employee_id);

        const availabilitiesResult = await db.query(
            `
        SELECT employee_id, day_of_week, start_time, end_time
        FROM availabletimes
        WHERE employee_id = ANY($1::int[])
        `,
            [employeeIds]
        );

        const availabilities = availabilitiesResult.rows;

        // Combine employees with their availabilities
        const employeesWithAvailability = employees.map((emp) => {
            const empAvailabilities = availabilities
                .filter((avail) => avail.employee_id === emp.employee_id)
                .map((avail) => ({
                    day_of_week: avail.day_of_week,
                    start_time: avail.start_time,
                    end_time: avail.end_time,
                }));
            return {
                // IDs can be included for internal use
                employee_id: emp.employee_id,
                phone_number: emp.phone_number,
                email: emp.email,
                name: emp.name,
                role: emp.role,
                availability: empAvailabilities,
            };
        });

        res.json(employeesWithAvailability);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getShifts = async (req, res) => {
    try {
        const orgAbbrev = req.query.org_abbreviation;
        if (!orgAbbrev) {
            return res.status(400).send('org_abbreviation is required');
        }

        // Fetch shifts and their roles with quantity
        const shiftsResult = await db.query(
            `
          SELECT
            s.id AS shift_id,
            rs.role_name AS role,
            s.day_of_week,
            s.start_time,
            s.end_time,
            rs.quantity
          FROM shifts s
          JOIN roleshifts rs ON s.id = rs.shift_id
          WHERE s.org_abbreviation = $1
          `,
            [orgAbbrev]
        );

        const shifts = shiftsResult.rows.map((shift) => ({
            shift_id: shift.shift_id,
            role: shift.role,
            day_of_week: shift.day_of_week,
            start_time: shift.start_time,
            end_time: shift.end_time,
            quantity: shift.quantity,
        }));

        res.json(shifts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.addShifts = async (req, res) => {
    try {
        const {
            role,
            day_of_week,
            start_time,
            end_time,
            quantity,
            org_abbreviation,
        } = req.body;

        if (
            !role ||
            !day_of_week ||
            !start_time ||
            !end_time ||
            !org_abbreviation ||
            quantity === undefined
        ) {
            return res.status(400).send('All fields are required');
        }

        // Check if the shift already exists in the shifts table
        const existingShiftResult = await db.query(
            `
            SELECT id AS shift_id
            FROM shifts
            WHERE day_of_week = $1
            AND start_time = $2
            AND end_time = $3
            AND org_abbreviation = $4
            `,
            [day_of_week, start_time, end_time, org_abbreviation]
        );

        let shiftId;

        if (existingShiftResult.rows.length > 0) {
            // Shift exists
            shiftId = existingShiftResult.rows[0].shift_id;

            if (quantity > 0) {
                // Update or insert into roleshifts table
                const existingRoleShiftResult = await db.query(
                    `
                    SELECT *
                    FROM roleshifts
                    WHERE shift_id = $1 AND role_name = $2 AND org_abbreviation = $3
                    `,
                    [shiftId, role, org_abbreviation]
                );

                if (existingRoleShiftResult.rows.length > 0) {
                    // RoleShift exists, update quantity
                    await db.query(
                        `
                        UPDATE roleshifts
                        SET quantity = $1
                        WHERE shift_id = $2 AND role_name = $3 AND org_abbreviation = $4
                        `,
                        [quantity, shiftId, role, org_abbreviation]
                    );
                } else {
                    // RoleShift does not exist, insert new
                    await db.query(
                        `
                        INSERT INTO roleshifts (shift_id, role_name, org_abbreviation, quantity)
                        VALUES ($1, $2, $3, $4)
                        `,
                        [shiftId, role, org_abbreviation, quantity]
                    );
                }
            } else {
                // Quantity is 0, delete from roleshifts
                await db.query(
                    `
            DELETE FROM roleshifts
            WHERE shift_id = $1 AND role_name = $2 AND org_abbreviation = $3
            `,
                    [shiftId, role, org_abbreviation]
                );

                // Check if there are any roles left for this shift
                const remainingRolesResult = await db.query(
                    `
            SELECT *
            FROM roleshifts
            WHERE shift_id = $1
            `,
                    [shiftId]
                );

                if (remainingRolesResult.rows.length === 0) {
                    // No roles left, delete the shift
                    await db.query(
                        `
              DELETE FROM shifts
              WHERE id = $1
              `,
                        [shiftId]
                    );
                }
            }
        } else {
            // Shift does not exist, insert into shifts table
            const shiftResult = await db.query(
                `
          INSERT INTO shifts (day_of_week, start_time, end_time, org_abbreviation)
          VALUES ($1, $2, $3, $4)
          RETURNING id AS shift_id, day_of_week, start_time, end_time, org_abbreviation
          `,
                [day_of_week, start_time, end_time, org_abbreviation]
            );

            const shift = shiftResult.rows[0];
            shiftId = shift.shift_id;

            // Insert into roleshifts table to associate role with shift and quantity
            if (quantity > 0) {
                await db.query(
                    `
            INSERT INTO roleshifts (shift_id, role_name, org_abbreviation, quantity)
            VALUES ($1, $2, $3, $4)
            `,
                    [shiftId, role, org_abbreviation, quantity]
                );
            } else {
                // Quantity is 0, do not insert into roleshifts
                // Optionally, you can delete the shift if you don't want shifts without roles
                await db.query(
                    `
            DELETE FROM shifts
            WHERE id = $1
            `,
                    [shiftId]
                );

                return res.status(400).send('Quantity must be greater than 0');
            }
        }

        // Return the updated or new shift with role and quantity
        const newShift = {
            shift_id: shiftId,
            role: role,
            day_of_week: day_of_week,
            start_time: start_time,
            end_time: end_time,
            org_abbreviation: org_abbreviation,
            quantity: quantity,
        };

        res.json(newShift);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.assignShifts = async (req, res) => {
    try {
        const { schedules } = req.body;

        if (!schedules || !Array.isArray(schedules)) {
            return res.status(400).send('Invalid data');
        }

        for (const schedule of schedules) {
            const {
                shift_id,
                employee_id,
                start_time,
                end_time,
                role,
            } = schedule;

            // Check if the record already exists
            const result = await db.query(
                `SELECT 1 FROM schedules 
                 WHERE shift_id = $1 AND emp_id = $2 AND start_time = $3 
                   AND end_time = $4 AND role = $5`,
                [shift_id, employee_id, start_time, end_time, role]
            );

            if (result.rows.length > 0) {
                // console.log(`Skipping duplicate schedule for emp_id ${employee_id} and shift_id ${shift_id}`);
                continue; // Skip this iteration if a duplicate exists
            }

            // Insert into schedules table if it doesn't exist
            await db.query(
                `INSERT INTO schedules (shift_id, emp_id, start_time, end_time, create_at)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                [shift_id, employee_id, start_time, end_time]
            );
        }

        res.status(200).send('Schedules created successfully.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getRoles = async (req, res) => {
    const org_abbreviation = req.query.org_abbreviation;

    if (!org_abbreviation) {
        return res.status(400).json({ error: 'Organization abbreviation is required' });
    }

    try {
        const query = `
            SELECT name, description, org_abbreviation
            FROM roles
            WHERE org_abbreviation = $1
            ORDER BY name ASC
        `;
        const { rows } = await db.query(query, [org_abbreviation]);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
};
