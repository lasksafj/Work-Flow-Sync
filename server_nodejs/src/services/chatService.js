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
        `select g.id AS "groupId", g.name AS "groupName", created_at
        from groups g inner join participants p on g.id = p.group_id
        where p.user_id = $1
        order by created_at desc`,
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
            'INSERT INTO participants (user_id, group_id, joined_at) VALUES ($1, $2, NOW())',
            [userId, groupChat.id]
        );
        await db.query('COMMIT');
        return groupChat;
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    }
}

exports.getParticipants = async (groupId) => {
    const result = await db.query(
        `select u.email, CONCAT(u.first_name, ' ', u.last_name) AS name
        from users u inner join participants p on u.id = p.user_id
        where p.group_id = $1`,
        [groupId]
    );
    return result.rows;
}

exports.addParticipants = async (groupId, participantEmails, userId) => {
    try {
        await db.query('BEGIN');
        for (const email of participantEmails) {
            const res = await db.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );
            const user = res.rows[0];
            if (!user) throw new Error('Participant not found');
            if (user.id == userId)
                continue;
            await db.query(
                'INSERT INTO participants (user_id, group_id, joined_at) VALUES ($1, $2, NOW())',
                [user.id, groupId]
            );
        }
        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    }
}

exports.getMessages = async (groupId, limit, offset) => {
    const res = await db.query(
        `SELECT m.id, m.content, m.create_time, m.user_id, m.group_id, u.email, u.first_name, u.last_name, u.avatar
        FROM messages m inner join users u on m.user_id = u.id
        WHERE m.group_id = $1
        ORDER BY m.create_time DESC LIMIT $2 OFFSET $3`,
        [groupId, limit, offset]
    );
    return res.rows;
};

exports.createMessage = async (groupId, userId, content) => {
    const res = await db.query(
        'INSERT INTO messages (group_id, user_id, content, create_time) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [groupId, userId, content]
    );
    let message = res.rows[0];
    const senderInfoQuery = await db.query(
        `select email, first_name, last_name, avatar from users
        where id = $1`,
        [message.user_id]
    );
    let sender = senderInfoQuery.rows[0];
    const data = {
        _id: message.id,
        text: message.content,
        createdAt: message.create_time,
        user: {
            _id: sender.email,
            name: sender.first_name + ' ' + sender.last_name,
            avatar: sender.avatar,
        }
    };
    return data;
};

exports.getEmployees = async (orgAbbr) => {
    const res = await db.query(
        `select email, first_name, last_name, avatar
        from users u inner join employees e on u.id = e.user_id
        inner join organizations o on o.abbreviation = e.org_abbreviation
        where o.abbreviation = $1`,
        [orgAbbr]
    );
    return res.rows;
}