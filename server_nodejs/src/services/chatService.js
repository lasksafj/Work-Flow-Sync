const db = require('../config/db');



exports.getGroups = async (userId) => {
    // const result = await db.query(
    //     `select 
    //         g.id AS "groupId", g.name AS "groupName", 
    //         json_agg(json_build_object(
    //             'email', u.email,
    //             'firstName', u.first_name,
    //             'lastName', u.last_name
    //         )) AS participants 
    //     from groups g inner join participants p on g.id = p.group_id
    //         inner join users u on u.id = p.user_id
    //     where g.id in (
    //         select g.id 
    //         from groups g inner join participants p on g.id = p.group_id
    //         where p.user_id = $1
    //     )
    //     GROUP BY g.id, g.name`,
    //     [userId]
    // );

    const result = await db.query(
        `select g.id AS "groupId", g.name AS "groupName"
        from groups g inner join participants p on g.id = p.group_id
            inner join users u on u.id = p.user_id
        where u.id = $1`,
        [userId]
    )
    return result.rows;
}

exports.getLastMessage = async (groupId) => {
    const result = await db.query(
        `select m.content, m.create_time
        from messages m
        where m.group_id = $1
        order by m.create_time desc
        limit 1`,
        [groupId]
    );
    return result.rows[0];
}

exports.createGroup = async (groupName, userId) => {
    try {
        await db.query('BEGIN');
        const groupRes = await db.query(
            'INSERT INTO groups (name, created_at) VALUES ($1, NOW()) RETURNING *',
            [groupName]
        );
        const groupChat = groupRes.rows[0];
        await db.query(
            'INSERT INTO participants (user_id, group_id) VALUES ($1, $2)',
            [userId, groupChat.id]
        );
        await db.query('COMMIT');
        return groupChat;
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    } finally {
        db.release();
    }
}

exports.addParticipant = async (groupId, participantEmails, userId) => {
    try {
        await db.query('BEGIN');
        for (const email of participantEmails) {
            const res = await db.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );
            const id = res.rows[0];
            if (!id) throw new Error('Participant not found');
            if (id == userId)
                continue;
            await db.query(
                'INSERT INTO participants (user_id, group_id) VALUES ($1, $2)',
                [id, groupId]
            );
        }
        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    } finally {
        db.release();
    }
}

exports.getMessages = async (groupId, limit, offset) => {
    const res = await db.query(
        'SELECT * FROM messages WHERE group_id = $1 ORDER BY create_time DESC LIMIT $2 OFFSET $3',
        [groupId, limit, offset]
    );
    return res.rows;
};

exports.createMessage = async (groupId, userId, message) => {
    const res = await db.query(
        'INSERT INTO messages (groupId, user_id, message, create_time) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [groupId, userId, message]
    );
    return res.rows[0];
};

exports.getEmployees = async (orgAbbr) => {
    const res = await db.query(
        `select email, first_name, last_name, img
        from users u inner join employees e on u.id = e.user_id
        inner join organizations o on o.abbreviation = e.org_abbreviation
        where o.abbreviation = $1`,
        [orgAbbr]
    );
    return res.rows;
}