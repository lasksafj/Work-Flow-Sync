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

select g.id AS "groupId", g.name AS "groupName"
from groups g inner join participants p on g.id = p.group_id
	inner join users u on u.id = p.user_id
where u.id = 3

