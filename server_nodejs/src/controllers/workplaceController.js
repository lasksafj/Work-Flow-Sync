const db = require("../config/db"); // Import the database configuration module to establish a connection

// Function to fetch organization details based on the logged-in user

exports.getRoles = async (req, res) => {
    try {
        const { org } = req.query;
        const result = await db.query(
            `SELECT r.name
            FROM roles r inner join organizations o 
            on r.org_abbreviation = o.abbreviation
            WHERE o.abbreviation = $1`,
            [org]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error response if query fails
    }
};

exports.getOrg = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the request, assuming the user is authenticated
        const result = await db.query(
            `SELECT o.abbreviation, o.name, o.address
            FROM users u 
            INNER JOIN employees e ON u.id = e.user_id
            INNER JOIN organizations o ON e.org_abbreviation = o.abbreviation
            WHERE u.id = $1`, // Query to fetch organization details for the logged-in user
            [userId]
        );

        res.status(200).json(result.rows); // Send the organization details back to the client
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error response if query fails
    }
};

// Function to get details of all employees in a specific organization
exports.getEmployeeDetails = async (req, res) => {
    try {
        const { org } = req.query; // Get organization abbreviation from query parameters
        const result = await db.query(
            `SELECT u.email, u.last_name, u.first_name, u.phone_number,
                u.date_of_birth, u.avatar, e.role_name
            FROM users u 
            INNER JOIN employees e ON e.user_id = u.id
            INNER JOIN organizations o ON o.abbreviation = e.org_abbreviation
            WHERE o.abbreviation = $1`, // Query to get employee details for a specified organization
            [org]
        );

        res.status(200).json(result.rows); // Send the employee details back to the client
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error response if query fails
    }
};

// Function to add a new workplace (organization)
exports.addWorkplace = async (req, res) => {
    try {
        const { name, abbreviation, address, startDate } = req.body; // Get workplace details from request body

        // Validate input fields
        if (!name || !abbreviation || !address || !startDate) {
            return res.status(400).json({ error: "Name, abbreviation, and address are required" });
        }

        // Check if a workplace with the same abbreviation already exists
        const existingWorkplace = await db.query(
            `SELECT * FROM organizations WHERE abbreviation = $1`,
            [abbreviation]
        );

        if (existingWorkplace.rows.length > 0) {
            return res.status(400).json({ error: "Workplace with this abbreviation already exists" });
        }

        // Insert the new workplace into the database
        const result = await db.query(
            `INSERT INTO organizations (name, abbreviation, address, start_date) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, abbreviation, address, startDate]
        );

        const newWorkplace = result.rows[0]; // Retrieve the newly created workplace data

        await db.query(
            `INSERT INTO roles (name, description, org_abbreviation)
            VALUES ($1, $2, $3)`,
            ['Owner', 'Owner of the workplace', abbreviation]
        )
        // Automatically add the current user as a Manager in the new workplace
        const userId = req.user.id; // Get the user ID from the request
        await db.query(
            `INSERT INTO employees (user_id, org_abbreviation, employee_number, pay_rate, role_name) 
            VALUES ($1, $2, 1, 0.00, 'Owner')`, // Assign the user as Manager with a default pay rate
            [userId, newWorkplace.abbreviation]
        );

        res.status(201).json(newWorkplace); // Return the created workplace to the client
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error response if query fails
    }
};

// Function to search for an employee by phone number
exports.searchEmployee = async (req, res) => {
    try {
        const { phoneNumber, orgAbbreviation } = req.query; // Get phone number and organization abbreviation from query
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        // Query to find the user with the given phone number
        const employeeResult = await db.query(
            `SELECT * FROM users WHERE phone_number = $1`,
            [phoneNumber]
        );

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({ error: "Employee with this phone number does not exist" });
        }

        let employee = employeeResult.rows[0]; // Retrieve the employee data

        // Check if the employee is already associated with the given organization
        const existingAssignment = await db.query(
            `SELECT * FROM employees WHERE user_id = $1 AND org_abbreviation = $2`,
            [employee.id, orgAbbreviation]
        );
        const isInOrg = existingAssignment.rows.length > 0; // Boolean indicating if the employee is in the organization

        delete employee.id; // Remove sensitive ID data before sending response
        res.status(200).json({
            employee: employee, // Employee details
            isInOrg: isInOrg // Boolean indicating if employee is already in the organization
        });
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error response if query fails
    }
};

// Function to add an employee to a workplace with specified role and pay rate
exports.addEmployeeToWorkplace = async (req, res) => {
    try {
        const { employeePhoneNumber, orgAbbreviation, role, payRate } = req.body; // Get data from request body

        // Validate input fields
        if (!employeePhoneNumber || !orgAbbreviation || !role || payRate === undefined) {
            return res.status(400).json({ error: "Employee phone number, organization abbreviation, role, and pay rate are required" });
        }

        // Fetch the highest employee number in the organization to assign a unique number to the new employee
        const empNumResult = await db.query(
            `SELECT MAX(employee_number) AS max_emp_num FROM employees WHERE org_abbreviation = $1`,
            [orgAbbreviation]
        );

        const maxEmpNum = empNumResult.rows[0].max_emp_num;
        const newEmployeeNumber = maxEmpNum ? maxEmpNum + 1 : 1; // Calculate new employee number

        // Find the user ID for the employee with the specified phone number
        const employeeResult = await db.query(
            `SELECT * FROM users WHERE phone_number = $1`,
            [employeePhoneNumber]
        );

        let employeeID = employeeResult.rows[0].id; // Get employee ID

        let numPayRate = Number(payRate); // Convert pay rate to a number if needed

        // Insert the employee with specified role and pay rate into the organization
        const result = await db.query(
            `INSERT INTO employees (user_id, org_abbreviation, employee_number, role_name, pay_rate) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [employeeID, orgAbbreviation, newEmployeeNumber, role, numPayRate]
        );

        // Return the new employee details along with the assigned role
        res.status(201).json({
            ...employeeResult.rows[0], // Existing employee details
            role_name: role, // New role
        });
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error response if query fails
    }
};

// Function to update an employee's role within an organization
exports.updateEmployeeRole = async (req, res) => {
    try {
        const { phoneNumber, orgAbbreviation, newRole } = req.body; // Get phone number, organization abbreviation, and new role from request body

        // Validate input fields
        if (!phoneNumber || !orgAbbreviation || !newRole) {
            return res.status(400).json({ error: "Phone number, organization abbreviation, and new role are required" });
        }

        // Find the user ID of the employee with the specified phone number
        const employeeResult = await db.query(
            `SELECT * FROM users WHERE phone_number = $1`,
            [phoneNumber]
        );

        let employeeID = employeeResult.rows[0].id; // Get employee ID

        // Update the employee's role in the organization
        const result = await db.query(
            `UPDATE employees 
            SET role_name = $1 
            WHERE user_id = $2 
            AND org_abbreviation = $3 
            RETURNING *`, // Query to update the role
            [newRole, employeeID, orgAbbreviation]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Employee is not part of the specified organization" });
        }

        // Return a success message and the updated employee record
        res.status(200).json({
            message: "Employee role updated successfully",
            updatedEmployee: result.rows[0]
        });
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error response if query fails
    }
};
