-- select g.id, g.name, u.email, u.first_name, u.last_name
-- from groups g inner join participants p on g.id = p.group_id
-- 	inner join users u on u.id = p.user_id
-- where g.id in (
-- 	select g.id 
-- 	from groups g inner join participants p on g.id = p.group_id
-- 	where p.user_id = 3
-- );

-- select m.content, m.create_time, u.email
-- from messages m inner join users u on m.user_id = u.id
-- where m.group_id = 3
-- order by m.create_time desc
-- limit 1;

-- select g.id AS "groupId", g.name AS "groupName"
-- from groups g inner join participants p on g.id = p.group_id
-- 	inner join users u on u.id = p.user_id
-- where u.id = 3


-- select g.id AS "groupId", g.name AS "groupName", MAX(m.create_time) as last_message_time, m.content as last_message
-- from groups g inner join participants p on g.id = p.group_id
-- 	inner join messages m on m.group_id = g.id
-- where p.user_id = 1
-- group by g.id, m.content
-- order by last_message_time desc



SELECT 
    g.id AS group_id, 
    g.name AS group_name, 
    g.created_at AS group_created_at, 
    m.create_time AS last_message_create_time, 
    m.content AS last_message_content
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
WHERE p.user_id = 1
order by COALESCE(last_message_create_time, g.created_at) DESC, 
    g.created_at DESC;












