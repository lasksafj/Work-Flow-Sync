// const userService = require('../services/userService');
const db = require("../config/db");

exports.getEarnings = async (req, res) => {
    try {
        const { org, limit = 10, offset = 0 } = req.query;

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
                    t.clock_in::date AS day_date,
                    EXTRACT(DOW FROM t.clock_in) AS day_of_week,
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
            daily_hours AS (
                SELECT
                    emp_id,
                    day_date,
                    pay_rate,
                    week_number,
                    week_start_date,
                    week_end_date,
                    SUM(hours_worked) AS total_daily_hours
                FROM
                    timesheet_data
                GROUP BY
                    emp_id, day_date, pay_rate, week_number, week_start_date, week_end_date
            ),
            daily_overtime AS (
                SELECT
                    emp_id,
                    day_date,
                    pay_rate,
                    week_number,
                    week_start_date,
                    week_end_date,
                    -- Calculate regular hours (up to 8 per day)
                    LEAST(total_daily_hours, 8) AS daily_regular_hours,
                    -- Calculate daily overtime hours (over 8 hours per day)
                    GREATEST(total_daily_hours - 8, 0) AS daily_overtime_hours
                FROM
                    daily_hours
            ),
            weekly_hours AS (
                SELECT
                    emp_id,
                    week_number,
                    week_start_date,
                    week_end_date,
                    pay_rate,
                    -- Sum up the regular hours for the week
                    SUM(daily_regular_hours) AS total_weekly_regular_hours,
                    -- Sum up the daily overtime hours for the week
                    SUM(daily_overtime_hours) AS total_weekly_daily_overtime_hours
                FROM
                    daily_overtime
                GROUP BY
                    emp_id, week_number, week_start_date, week_end_date, pay_rate
            ),
            weekly_overtime AS (
                SELECT
                    *,
                    -- Calculate weekly overtime hours (regular hours over 40 in a week)
                    GREATEST(total_weekly_regular_hours - 40, 0) AS weekly_overtime_hours,
                    -- Adjust regular hours (can't exceed 40 for regular pay)
                    LEAST(total_weekly_regular_hours, 40) AS adjusted_weekly_regular_hours
                FROM
                    weekly_hours
            ),
            weekly_payments AS (
                SELECT
                    emp_id,
                    week_number,
                    week_start_date,
                    week_end_date,
                    pay_rate,
                    adjusted_weekly_regular_hours,
                    total_weekly_daily_overtime_hours,
                    weekly_overtime_hours,
                    -- Calculate pay components
                    (adjusted_weekly_regular_hours * pay_rate) AS regular_pay,
                    (total_weekly_daily_overtime_hours * pay_rate * 1.5) AS daily_overtime_pay,
                    (weekly_overtime_hours * pay_rate * 1.5) AS weekly_overtime_pay,
                    -- Total overtime pay
                    ((total_weekly_daily_overtime_hours + weekly_overtime_hours) * pay_rate * 1.5) AS total_overtime_pay,
                    -- Total pay
                    ((adjusted_weekly_regular_hours * pay_rate) + ((total_weekly_daily_overtime_hours + weekly_overtime_hours) * pay_rate * 1.5)) AS total_pay
                FROM
                    weekly_overtime
            ),
            biweekly_periods AS (
                SELECT
                    *,
                    FLOOR((week_start_date::date - start_date::date)::integer / 14) + 1 AS period_number,
                    start_date + ((FLOOR((week_start_date::date - start_date::date)::integer / 14)) * INTERVAL '14 days') AS period_start_date,
                    start_date + ((FLOOR((week_start_date::date - start_date::date)::integer / 14)) * INTERVAL '14 days') + INTERVAL '13 days' AS period_end_date
                FROM
                    (
                        SELECT
                            wp.*,
                            o.start_date
                        FROM
                            weekly_payments wp
                        JOIN
                            employees e ON wp.emp_id = e.id
                        JOIN
                            organizations o ON e.org_abbreviation = o.abbreviation
                    ) sub
            ),
            biweekly_summaries AS (
                SELECT
                    period_number,
                    period_start_date,
                    period_end_date,
                    SUM(adjusted_weekly_regular_hours) AS total_regular_hours,
                    SUM(total_weekly_daily_overtime_hours) AS total_daily_overtime_hours,
                    SUM(weekly_overtime_hours) AS total_weekly_overtime_hours,
                    SUM(regular_pay) AS total_regular_pay,
                    SUM(daily_overtime_pay) AS total_daily_overtime_pay,
                    SUM(weekly_overtime_pay) AS total_weekly_overtime_pay,
                    SUM(total_pay) AS total_payment
                FROM
                    biweekly_periods
                GROUP BY
                    period_number, period_start_date, period_end_date
            )
            SELECT
                ROUND(total_regular_hours::numeric, 2) AS "normalWorkHours",
                ROUND((total_daily_overtime_hours + total_weekly_overtime_hours)::numeric, 2) AS "overtimeWorkHours",
                TO_CHAR(period_start_date, 'Mon DD') || ' - ' || TO_CHAR(period_end_date, 'Mon DD') AS "date",
                ROUND(total_payment::numeric, 2) AS "payment"
            FROM
                biweekly_summaries
            ORDER BY
                period_number DESC
            LIMIT $3 OFFSET $4;`,
            [req.user.id, org, limit, offset]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};