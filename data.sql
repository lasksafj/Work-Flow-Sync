--Populating the 'organizations' table
INSERT INTO organizations(abbreviation, name, address, start_date) VALUES
    ('ABC', 'ABC Corporation', '123 Main Street', '2020-01-01'),
    ('XYZ', 'XYZ Ltd.', '456 Elm Street', '2018-05-15');

--Populating the 'roles' table(updated column name to 'org_abbreviation')
INSERT INTO roles(name, description, org_abbreviation) VALUES
    ('Manager', 'Manages teams', 'ABC'),
    ('Developer', 'Writes code', 'ABC'),
    ('Tester', 'Tests code', 'ABC'),
    ('Sales', 'Handles sales', 'XYZ'),
    ('Support', 'Customer support', 'XYZ');

--Populating the 'users' table(no significant changes)
INSERT INTO users(email, password, last_name, first_name, phone_number, date_of_birth, avatar, expo_push_token) VALUES
    ('aaa@gmail.com', '$2b$10$IVSrdc7fG.vSZBMOOWiYbeMT9zzm4Dwtb8kxxO7KrNvrP220hZLxG', 'Doe', 'John', '5551234567', '1990-06-15', NULL, NULL),
    ('bbb@gmail.com', '$2b$10$IVSrdc7fG.vSZBMOOWiYbeMT9zzm4Dwtb8kxxO7KrNvrP220hZLxG', 'Smith', 'Jane', '5557654321', '1985-09-20', NULL, NULL),
    ('ccc@gmail.com', '$2b$10$IVSrdc7fG.vSZBMOOWiYbeMT9zzm4Dwtb8kxxO7KrNvrP220hZLxG', 'Jones', 'Bob', '5551112222', '1992-12-05', NULL, NULL),
    ('ddd@gmail.com', '$2b$10$IVSrdc7fG.vSZBMOOWiYbeMT9zzm4Dwtb8kxxO7KrNvrP220hZLxG', 'Williams', 'Alice', '5553334444', '1988-03-22', NULL, NULL);

--Populating the 'employees' table(updated column name to 'org_abbreviation' and unique constraints)
INSERT INTO employees(employee_number, pay_rate, user_id, role_name, org_abbreviation) VALUES
    (1001, 50000.00, 1, 'Developer', 'ABC'),
    (1002, 60000.00, 2, 'Manager', 'ABC'),
    (1003, 55000.00, 3, 'Tester', 'ABC'),
    (1004, 50000.00, 4, 'Developer', 'ABC');

--Populating the 'availabletimes' table(updated primary key and constraints)
INSERT INTO availabletimes(start_time, end_time, employee_id, day_of_week) VALUES
    ('09:00:00', '17:00:00', 1, 'Monday'),
    ('10:00:00', '18:00:00', 2, 'Tuesday'),
    ('08:00:00', '16:00:00', 3, 'Wednesday'),
    ('09:00:00', '17:00:00', 4, 'Thursday');

--Populating the 'groups' table(no changes)
INSERT INTO groups(name, created_at, img) VALUES
    ('Development Team', '2020-01-15 10:00:00', NULL),
    ('QA Team', '2020-02-20 11:00:00', NULL);

--Populating the 'participants' table(no changes)
INSERT INTO participants(joined_at, user_id, group_id, last_active_time) VALUES
    ('2020-01-15', 1, 1, '2024-11-19 09:00:00'),
    ('2020-01-15', 2, 1, '2024-11-19 09:00:00'),
    ('2020-02-20', 3, 2, '2024-11-19 09:00:00'),
    ('2024-11-19', 4, 1, '2024-11-19 17:05:00');

--Populating the 'messages' table(no changes needed)
INSERT INTO messages(id, content, create_time, user_id, group_id) VALUES
    ('msg1', 'Hello team!', '2020-01-15 10:05:00', 1, 1),
    ('msg2', 'Welcome!', '2020-01-15 10:06:00', 2, 1),
    ('msg3', 'Testing message', '2020-02-20 11:05:00', 3, 2),
    ('msg4', 'Excited to join the team!', '2024-11-19 17:10:00', 4, 1);

--Populating the 'notifications' table(no changes)
INSERT INTO notifications(content, created_date, sender_id, is_read) VALUES
    ('Your schedule has been updated', '2020-03-01 12:00:00', 2, FALSE),
    ('Meeting at 3 PM', '2020-03-01 13:00:00', 1, FALSE),
    ('Welcome to the team!', '2024-11-19 17:15:00', 2, FALSE);

--Populating the 'notification_receivers' table(no changes)
INSERT INTO notification_receivers(notification_id, receiver_id) VALUES
    (1, 1),
    (1, 3),
    (2, 2),
    (2, 3),
    (3, 4);

--Populating the 'shifts' table(updated column name to 'org_abbreviation')
INSERT INTO shifts(day_of_week, start_time, end_time, org_abbreviation) VALUES
    ('Monday', '09:00:00', '17:00:00', 'ABC'),
    ('Tuesday', '09:00:00', '17:00:00', 'ABC'),
    ('Wednesday', '09:00:00', '17:00:00', 'ABC'),
    ('Thursday', '09:00:00', '17:00:00', 'ABC');

--Populating the 'roleshifts' table(updated column name to 'org_abbreviation')
INSERT INTO roleshifts(role_name, org_abbreviation, shift_id, quantity) VALUES
    ('Developer', 'ABC', 1, 3),
    ('Developer', 'ABC', 2, 3),
    ('Tester', 'ABC', 3, 2),
    ('Developer', 'ABC', 4, 2);

--Populating the 'schedules' table(no changes)
INSERT INTO schedules(emp_id, start_time, end_time, create_at, shift_id) VALUES
    (1, '2024-11-23 09:00:00', '2024-11-23 17:00:00', '2024-11-19 10:00:00', 1),
    (2, '2024-11-23 09:00:00', '2024-11-23 17:00:00', '2024-11-19 10:00:00', 3),
    (3, '2024-11-23 09:00:00', '2024-11-23 17:00:00', '2024-11-19 10:00:00', 4),
    (4, '2024-11-26 09:00:00', '2024-11-26 17:00:00', '2024-11-19 10:00:00', 4);

--Populating the 'timesheets' table(no changes)
INSERT INTO timesheets(clock_in, clock_out, emp_id) VALUES
    ('2024-11-23 09:00:00', '2024-11-23 17:00:00', 1),
    ('2024-11-23 09:00:00', '2024-11-23 17:00:00', 2),
    ('2024-11-23 09:00:00', '2024-11-23 17:00:00', 3),
    ('2024-11-26 09:00:00', '2024-11-26 17:00:00', 4);

--Populating the 'feedbacks' table(no changes)
INSERT INTO feedbacks(content, created_date, emp_id) VALUES
    ('Great work environment', '2024-11-19 15:00:00', 1),
    ('Need more resources', '2024-11-19 15:30:00', 2),
    ('Happy with the team', '2024-11-19 16:00:00', 3),
    ('Looking forward to the new project', '2024-11-19 17:00:00', 4);

--Populating the 'request' table(updated column name to 'employee_id')
INSERT INTO request(schedules_id, status, reason, request_time, manager_id, approved_time, employee_id) VALUES
    (1, 'Pending', 'Need to swap shift', '2024-11-20 10:00:00', 2, NULL, 1),
    (3, 'Approved', 'Personal reason', '2024-11-20 11:00:00', 2, '2024-11-20 12:00:00', 3);

--Populating the 'exchange' table(updated column name to 'employee_id')
INSERT INTO exchange(request_id, employee_id, schedules_id) VALUES
    (1, 3, 3);

--Populating the 'notification_receivers' table(additional entries)
INSERT INTO notification_receivers(notification_id, receiver_id) VALUES
    (3, 1),
    (3, 2);

--Populating the 'messages' table(additional message)
INSERT INTO messages(id, content, create_time, user_id, group_id) VALUES
    ('msg5', 'Don\'t forget the meeting tomorrow.', '2024-11-19 18:00:00', 2, 1);

--Populating the 'timesheets' table(additional entries for 'ABC' organization)
INSERT INTO timesheets(clock_in, clock_out, emp_id) VALUES
    ('2024-11-24 09:00:00', '2024-11-24 17:00:00', 1),
    ('2024-11-24 09:00:00', '2024-11-24 17:00:00', 4);

--Populating the 'availabletimes' table(additional entries for 'ABC' organization)
INSERT INTO availabletimes(start_time, end_time, employee_id, day_of_week) VALUES
    ('09:00:00', '17:00:00', 1, 'Friday'),
    ('09:00:00', '17:00:00', 4, 'Friday');

--Populating the 'shifts' table(additional entry for 'ABC' organization)
INSERT INTO shifts(day_of_week, start_time, end_time, org_abbreviation) VALUES
    ('Friday', '09:00:00', '17:00:00', 'ABC');

--Populating the 'roleshifts' table(additional entry for 'ABC' organization)
    --Assuming the new shift has ID 5(auto - incremented after previous inserts)
INSERT INTO roleshifts(role_name, org_abbreviation, shift_id, quantity) VALUES
    ('Developer', 'ABC', 5, 2);

