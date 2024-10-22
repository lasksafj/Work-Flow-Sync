// const userService = require('../services/userService');
const db = require("../config/db");

exports.earnings = async (req, res) => {
    try {
        // data = [
        //     {
        //         workHours: 75,
        //         date: "Jun 15 - Jun 30",
        //         payment: 2341.64,
        //     },
        //     {
        //         workHours: 45,
        //         date: "Jun 1 - Jun 15",
        //         payment: 1234,
        //     },
        //     {
        //         workHours: 75,
        //         date: "Jun 15 - Jun 30",
        //         payment: 2341.64,
        //     },
        //     {
        //         workHours: 45,
        //         date: "Jun 1 - Jun 15",
        //         payment: 1234,
        //     },
        //     {
        //         workHours: 75,
        //         date: "Jun 15 - Jun 30",
        //         payment: 2341.64,
        //     },
        //     {
        //         workHours: 45,
        //         date: "Jun 1 - Jun 15",
        //         payment: 1234,
        //     },
        // ]

        const { org, offset = 0, limit = 10 } = req.query;
        console.log(req.query);


        // ----------------------------------------------------------------------------------------------
        // not have overtime calculation
        // const result = await db.query(
        //     `WITH timesheet_data AS (
        //         SELECT
        //             e.id AS emp_id,
        //             e.pay_rate,
        //             o.start_date,
        //             t.clock_in,
        //             t.clock_out,
        //             FLOOR((t.clock_in::date - o.start_date)::integer / 14) + 1 AS period_number,
        //             o.start_date + ((FLOOR((t.clock_in::date - o.start_date)::integer / 14)) * INTERVAL '14 days') AS period_start_date,
        //             o.start_date + ((FLOOR((t.clock_in::date - o.start_date)::integer / 14)) * INTERVAL '14 days') + INTERVAL '13 days' AS period_end_date,
        //             EXTRACT(EPOCH FROM (t.clock_out - t.clock_in)) / 3600 AS hours_worked
        //         FROM
        //             timesheets t
        //         JOIN
        //             employees e ON t.emp_id = e.id
        //         JOIN
        //             organizations o ON e.org_abbreviation = o.abbreviation
        //         WHERE
        //             e.user_id = $1
        //             AND e.org_abbreviation = $2
        //     )
        //     SELECT
        //         SUM(hours_worked) AS "workHours",
        //         TO_CHAR(period_start_date, 'Mon DD') || ' - ' || TO_CHAR(period_end_date, 'Mon DD') AS "date",
        //         ROUND(SUM((hours_worked * pay_rate)::numeric), 2) AS "payment"
        //     FROM
        //         timesheet_data
        //     GROUP BY
        //         period_number, period_start_date, period_end_date
        //     ORDER BY
        //         period_number DESC
        //     LIMIT $3 OFFSET $4;
        //     `,      
        //     [req.user.id, req.query.org, limit, offset]
        // );


        // ----------------------------------------------------------------------------------------------
        // include overtime calculation, only weekly overtime
        const result = await db.query(
            `
            WITH timesheet_data AS (
                SELECT
                    e.id AS emp_id,
                    e.pay_rate,
                    o.start_date,
                    t.clock_in,
                    t.clock_out,
                    FLOOR((t.clock_in::date - o.start_date)::integer / 7) + 1 AS week_number,
                    o.start_date + ((FLOOR((t.clock_in::date - o.start_date)::integer / 7)) * INTERVAL '7 days') AS week_start_date,
                    o.start_date + ((FLOOR((t.clock_in::date - o.start_date)::integer / 7)) * INTERVAL '7 days') + INTERVAL '6 days' AS week_end_date,
                    EXTRACT(EPOCH FROM (t.clock_out - t.clock_in)) / 3600 AS hours_worked
                FROM
                    timesheets t
                JOIN
                    employees e ON t.emp_id = e.id
                JOIN
                    organizations o ON e.org_abbreviation = o.abbreviation
                WHERE
                    e.user_id = $1
                    AND e.org_abbreviation = $2
            ),
            weekly_hours AS (
                SELECT
                    emp_id,
                    week_number,
                    week_start_date,
                    week_end_date,
                    pay_rate,
                    start_date,
                    SUM(hours_worked) AS total_hours
                FROM
                    timesheet_data
                GROUP BY
                    emp_id, week_number, week_start_date, week_end_date, pay_rate, start_date
            ),
            weekly_payments AS (
                SELECT
                    *,
                    LEAST(total_hours, 40) AS regular_hours,
                    GREATEST(total_hours - 40, 0) AS overtime_hours,
                    (LEAST(total_hours, 40) * pay_rate) AS regular_pay,
                    (GREATEST(total_hours - 40, 0) * pay_rate * 1.5) AS overtime_pay,
                    ((LEAST(total_hours, 40) * pay_rate) + (GREATEST(total_hours - 40, 0) * pay_rate * 1.5)) AS total_pay
                FROM
                    weekly_hours
            ),
            biweekly_periods AS (
                SELECT
                    *,
                    FLOOR((week_start_date::date - start_date::date)::integer / 14) + 1 AS period_number,
                    start_date + ((FLOOR((week_start_date::date - start_date::date)::integer / 14)) * INTERVAL '14 days') AS period_start_date,
                    start_date + ((FLOOR((week_start_date::date - start_date::date)::integer / 14)) * INTERVAL '14 days') + INTERVAL '13 days' AS period_end_date
                FROM
                    weekly_payments
            ),
            biweekly_summaries AS (
                SELECT
                    period_number,
                    period_start_date,
                    period_end_date,
                    SUM(regular_hours) AS total_regular_hours,
                    SUM(overtime_hours) AS total_overtime_hours,
                    SUM(regular_pay) AS total_regular_pay,
                    SUM(overtime_pay) AS total_overtime_pay,
                    SUM(total_pay) AS total_payment
                FROM
                    biweekly_periods
                GROUP BY
                    period_number, period_start_date, period_end_date
            )
            SELECT
                ROUND(total_regular_hours::numeric, 2) AS "normalWorkHours",
                ROUND(total_overtime_hours::numeric, 2) AS "overtimeWorkHours",
                TO_CHAR(period_start_date, 'Mon DD') || ' - ' || TO_CHAR(period_end_date, 'Mon DD') AS "date",
                ROUND(total_payment::numeric, 2) AS "payment"
            FROM
                biweekly_summaries
            ORDER BY
                period_number DESC
            LIMIT $3 OFFSET $4;`,
            [req.user.id, org, limit, offset]
        );



        // ----------------------------------------------------------------------------------------------
        // include overtime calculation, daily overtime and weekly overtime
        // const result = await db.query(
        //     `WITH timesheet_data AS (
        //         SELECT
        //             e.id AS emp_id,
        //             e.pay_rate,
        //             o.start_date,
        //             t.clock_in,
        //             t.clock_out,
        //             t.clock_in::date AS work_date,
        //             FLOOR((t.clock_in::date - o.start_date)::integer / 7) + 1 AS week_number,
        //             o.start_date + ((FLOOR((t.clock_in::date - o.start_date)::integer / 7)) * INTERVAL '7 days') AS week_start_date,
        //             o.start_date + ((FLOOR((t.clock_in::date - o.start_date)::integer / 7)) * INTERVAL '7 days') + INTERVAL '6 days' AS week_end_date,
        //             EXTRACT(EPOCH FROM (t.clock_out - t.clock_in)) / 3600 AS hours_worked
        //         FROM
        //             timesheets t
        //         JOIN
        //             employees e ON t.emp_id = e.id
        //         JOIN
        //             organizations o ON e.org_abbreviation = o.abbreviation
        //         WHERE
        //             e.user_id = $1
        //             AND e.org_abbreviation = $2
        //     ),
        //     daily_hours AS (
        //         SELECT
        //             emp_id,
        //             pay_rate,
        //             start_date,
        //             week_number,
        //             week_start_date,
        //             week_end_date,
        //             work_date,
        //             SUM(hours_worked) AS total_daily_hours,
        //             LEAST(SUM(hours_worked), 8) AS regular_daily_hours,
        //             GREATEST(SUM(hours_worked) - 8, 0) AS overtime_daily_hours
        //         FROM
        //             timesheet_data
        //         GROUP BY
        //             emp_id,
        //             pay_rate,
        //             start_date,
        //             week_number,
        //             week_start_date,
        //             week_end_date,
        //             work_date
        //     ),
        //     weekly_hours AS (
        //         SELECT
        //             emp_id,
        //             pay_rate,
        //             start_date,
        //             week_number,
        //             week_start_date,
        //             week_end_date,
        //             SUM(regular_daily_hours) AS total_weekly_regular_hours,
        //             SUM(overtime_daily_hours) AS total_weekly_overtime_hours
        //         FROM
        //             daily_hours
        //         GROUP BY
        //             emp_id,
        //             pay_rate,
        //             start_date,
        //             week_number,
        //             week_start_date,
        //             week_end_date
        //     ),
        //     weekly_payments AS (
        //         SELECT
        //             *,
        //             -- Calculate additional overtime if total regular hours exceed 40 in a week
        //             LEAST(total_weekly_regular_hours, 40) AS weekly_regular_hours,
        //             total_weekly_overtime_hours + GREATEST(total_weekly_regular_hours - 40, 0) AS weekly_overtime_hours,
        //             (LEAST(total_weekly_regular_hours, 40) * pay_rate) AS regular_pay,
        //             ((total_weekly_overtime_hours + GREATEST(total_weekly_regular_hours - 40, 0)) * pay_rate * 1.5) AS overtime_pay,
        //             ((LEAST(total_weekly_regular_hours, 40) * pay_rate) + ((total_weekly_overtime_hours + GREATEST(total_weekly_regular_hours - 40, 0)) * pay_rate * 1.5)) AS total_pay
        //         FROM
        //             weekly_hours
        //     ),
        //     biweekly_periods AS (
        //         SELECT
        //             *,
        //             FLOOR((week_start_date::date - start_date::date)::integer / 14) + 1 AS period_number,
        //             start_date + ((FLOOR((week_start_date::date - start_date::date)::integer / 14)) * INTERVAL '14 days') AS period_start_date,
        //             start_date + ((FLOOR((week_start_date::date - start_date::date)::integer / 14)) * INTERVAL '14 days') + INTERVAL '13 days' AS period_end_date
        //         FROM
        //             weekly_payments
        //     ),
        //     biweekly_summaries AS (
        //         SELECT
        //             period_number,
        //             period_start_date,
        //             period_end_date,
        //             SUM(weekly_regular_hours) AS total_regular_hours,
        //             SUM(weekly_overtime_hours) AS total_overtime_hours,
        //             SUM(regular_pay) AS total_regular_pay,
        //             SUM(overtime_pay) AS total_overtime_pay,
        //             SUM(total_pay) AS total_payment
        //         FROM
        //             biweekly_periods
        //         GROUP BY
        //             period_number, period_start_date, period_end_date
        //     )
        //     SELECT
        //         ROUND(total_regular_hours::numeric, 2) AS "normalWorkHours",
        //         ROUND(total_overtime_hours::numeric, 2) AS "overtimeWorkHours",
        //         TO_CHAR(period_start_date, 'Mon DD') || ' - ' || TO_CHAR(period_end_date, 'Mon DD') AS "date",
        //         ROUND(total_payment::numeric, 2) AS "payment"
        //     FROM
        //         biweekly_summaries
        //     ORDER BY
        //         period_number DESC
        //     LIMIT $3 OFFSET $4;`,
        //     [req.user.id, req.query.org, limit, offset]
        // );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};