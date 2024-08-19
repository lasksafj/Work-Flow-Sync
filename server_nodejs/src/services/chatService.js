const db = require('../config/db');



exports.getGroups = async (userId, limit, offset) => {
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

    // add group img??
    const result = await db.query(
        `SELECT 
            g.id AS "groupId", 
            g.name AS "groupName", 
            g.created_at AS "groupCreatedAt", 
            m.create_time AS "lastMessageTime", 
            m.content AS "lastMessage",
            p.last_active_time AS "lastActiveTime"
        FROM 
            groups g
        INNER JOIN participants p on p.group_id = g.id
        LEFT JOIN 
            (SELECT 
                group_id, 
                MAX(create_time) AS last_message_create_time 
            FROM 
                messages 
            GROUP BY 
                group_id) lm 
            ON g.id = lm.group_id
        LEFT JOIN 
            messages m 
            ON lm.group_id = m.group_id AND lm.last_message_create_time = m.create_time
        WHERE p.user_id = $1
        order by COALESCE(last_message_create_time, g.created_at) DESC, 
            g.created_at DESC 
        LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    )
    return result.rows;
}

exports.getGroupInfo = async (groupId) => {
    const res = await db.query(`select * from groups where id = $1`, [groupId]);
    return res.rows[0];
}

// exports.getLastMessage = async (groupId) => {
//     const result = await db.query(
//         `select m.content, m.create_time
//         from messages m
//         where m.group_id = $1
//         order by m.create_time desc
//         limit 1`,
//         [groupId]
//     );
//     return result.rows[0];
// }

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
        `select u.email, CONCAT(u.first_name, ' ', u.last_name) AS name, u.avatar
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

exports.getGroupWith2Participants = async (participantEmails) => {
    const res = await db.query(`
        select g.id
        from groups g inner join participants p on g.id = p.group_id
            inner join users u on p.user_id = u.id
        where u.email IN ($1, $2)
        group by g.id
        HAVING COUNT(DISTINCT u.id) = 2
        AND COUNT(DISTINCT u.email) = 2
        AND COUNT(*) = 2;`,
        participantEmails
    );
    return res.rows[0];
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

exports.createMessage = async (groupId, userId, content, messageId) => {
    const res = await db.query(
        'INSERT INTO messages (id, group_id, user_id, content, create_time) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [messageId, groupId, userId, content]
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
        `select u.email, u.first_name, u.last_name, u.avatar
        from users u inner join employees e on u.id = e.user_id
        where e.org_abbreviation = $1
		group by u.email, u.first_name, u.last_name, u.avatar`,
        [orgAbbr]
    );
    return res.rows;
}

exports.updateActiveTimeParticipant = async (userId, groupId) => {
    const res = await db.query(`
        UPDATE participants 
        SET last_active_time = NOW()
        WHERE user_id = $1 AND group_id = $2
        RETURNING *`,
        [userId, groupId]);
    return res.rows[0];
}

exports.getLastActiveTimeParticipant = async (userId, groupId) => {
    const res = await db.query(`
        select last_active_time
        from participants 
        WHERE user_id = $1 AND group_id = $2`,
        [userId, groupId]);
    return res.rows[0].last_active_time;
}

