const db = require('../config/db');

exports.getGroups = async (userId) => {
    const result = await db.query(
        'SELECT g.id, g.name ' +
        'FROM users u inner join participants p on u.id = p.user_id ' +
        'inner join groups g on p.group_id = g.id ' +
        'WHERE u.id = $1', [userId]);
    return result.rows;
}