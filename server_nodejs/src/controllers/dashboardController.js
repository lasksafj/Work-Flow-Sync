const db = require("../config/db"); // Import the database configuration module

// Controller function to handle an example GET request
exports.getExample = async (req, res) => {
    try {
        const userId = req.user.id; // Retrieve the user ID from the authenticated request

        // For GET requests, extract num1 and num2 from the query parameters
        const { num1, num2 } = req.query;

        // For POST or PUT requests, you might extract num1 and num2 from the request body
        // const { num1, num2 } = req.body;

        // Perform an operation (e.g., adding two numbers)
        let result = parseInt(num1) + parseInt(num2);

        // Send the result back as a JSON response with HTTP status 200 (OK)
        res.status(200).json({ num: result });
    } catch (error) {
        // Handle any errors by sending a JSON response with HTTP status 400 (Bad Request)
        res.status(400).json({ error: error.message });
    }
};

// Controller function to retrieve detailed shift information
exports.getDetailShift = async (req, res) => {
    try {
        const { orgAbbr } = req.query; // Extract the organization abbreviation from query parameters
        console.log(orgAbbr); // Log the organization abbreviation for debugging purposes

        // Execute a parameterized SQL query to fetch shift details
        const result = await db.query(
            `SELECT 
                s.start_time, 
                s.end_time, 
                e.role_name, 
                o.name as organization_name
            FROM 
                schedules s
            JOIN 
                employees e ON s.emp_id = e.id
            JOIN 
                users u ON e.user_id = u.id
            JOIN 
                organizations o ON e.org_abbreviation = o.abbreviation
            WHERE 
                u.id = $1 
                AND o.abbreviation = $2;
            `,
            [req.user.id, orgAbbr] // Pass user ID and organization abbreviation as parameters to prevent SQL injection
        );

        const data = result.rows; // Extract the rows (data) from the query result
        console.log(data); // Log the data for debugging purposes

        // Send the retrieved data as a JSON response with HTTP status 200 (OK)
        res.status(200).json(data);
    } catch (error) {
        // Handle any errors by sending a JSON response with HTTP status 400 (Bad Request)
        res.status(400).json({ error: error.message });
    }
};
