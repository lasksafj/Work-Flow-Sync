const moment = require('moment');
const db = require('../config/db');

const getUserData = async (userId) => {
    // Implement the logic to get user data
}

const isDataExist = async (empId, startDate) => {
    const formattedDate = new Date(startDate).toISOString().split('T')[0];
    const query = 'SELECT * FROM schedules WHERE DATE(start_time) = $1 AND emp_id = $2';
    let data = await db.query(query, [formattedDate, empId]);
    return data.rows.length > 0;
}

const addScheduleData = async (scheduleData, empId) => {
    const query = 'INSERT INTO schedules (start_time, end_time, emp_id) VALUES ($1, $2, $3) RETURNING *';
    await db.query(query, [scheduleData['start'], scheduleData['end'], empId]);
}

const updateScheduleData = async (scheduleData, empId) => {
    // const formattedDate = new Date(scheduleData['start']).toISOString().split('T')[0];
    const query = 'UPDATE schedules SET start_time = $1, end_time = $2 WHERE DATE(start_time) = $3 AND emp_id = $4';
    await db.query(query, [scheduleData.start, scheduleData.end, scheduleData.start, empId]);
}

const handleUpdateSchedule = async (userId, workingData, orgId) => {
    console.log('handleUpdateSchedule: ', workingData);

    try {
        const empQuery = 'SELECT id FROM employees WHERE user_id = $1 AND org_abbreviation = $2';
        const empResult = await db.query(empQuery, [userId, 'ORG1']);
        const employeeId = empResult.rows[0].id;

        await db.query('BEGIN');

        for (let i = 0; i < workingData.length; i++) {
            let isExist = await isDataExist(employeeId, workingData[i]['start']);
            if (isExist) {
                await updateScheduleData(workingData[i], employeeId);
            } else {
                await addScheduleData(workingData[i], employeeId);
            }
        }
        await db.query('COMMIT');
        return {
            EM: 'Success!',
            EC: 0
        };
    } catch (e) {
        await db.query('ROLLBACK');

        throw new Error('Cannot update data');
    }
}

const handleFetchAllSchedule = async (date, orgId) => {
    try {
        const formattedDate = moment(date).format('YYYY-MM-DD');

        const query = "select u.id, u.first_name, u.last_name, e.id, s.start_time, s.end_time, o.name from employees as e "
            + "inner join users as u on u.id = e.user_id inner join schedules as s on e.id = s.emp_id "
            + "inner join organizations as o on o.abbreviation = e.org_abbreviation "
            + "where e.org_abbreviation = $1 and Date(start_time) = $2"

        const data = await db.query(query, ['ABC', formattedDate]);
        data.res_name = ''
        return {
            EM: 'Success',
            EC: 0,
            ED: data.rows
        }
    } catch (e) {
        console.log('handleFetchAllSchedule: ', e)
        throw new Error('Can not fetch data')
    }
}

module.exports = {
    getUserData,
    handleUpdateSchedule,
    handleFetchAllSchedule
}