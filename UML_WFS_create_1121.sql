-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-11-22 00:38:48.495

-- tables
-- Table: availabletimes
CREATE TABLE availabletimes (
    start_time time  NOT NULL,
    end_time time  NOT NULL,
    employee_id int  NOT NULL,
    day_of_week varchar(20)  NOT NULL,
    CONSTRAINT availabletimes_pk PRIMARY KEY (employee_id,day_of_week,end_time,start_time)
);

-- Table: employees
CREATE TABLE employees (
    id serial  NOT NULL,
    employee_number int  NOT NULL,
    pay_rate decimal(7,2)  NOT NULL,
    user_id int  NOT NULL,
    role_name varchar(80)  NOT NULL,
    org_abbreviation varchar(10)  NOT NULL,
    CONSTRAINT Employee_uk_01 UNIQUE (user_id, org_abbreviation, employee_number) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT employees_uk_2 UNIQUE (user_id, org_abbreviation, role_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT employees_pk PRIMARY KEY (id)
);

CREATE INDEX employees_idx_1 on employees (user_id ASC);

-- Table: exchange
CREATE TABLE exchange (
    request_id int  NOT NULL,
    employee_id int  NOT NULL,
    schedules_id int  NOT NULL,
    CONSTRAINT exchange_pk PRIMARY KEY (request_id,employee_id,schedules_id)
);

-- Table: feedbacks
CREATE TABLE feedbacks (
    content varchar(500)  NOT NULL,
    created_date timestamp  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT feedbacks_pk PRIMARY KEY (created_date,emp_id)
);

-- Table: groups
CREATE TABLE groups (
    id serial  NOT NULL,
    name varchar(80)  NOT NULL,
    created_at timestamp  NOT NULL,
    img varchar(200)  NULL,
    CONSTRAINT groups_pk PRIMARY KEY (id)
);

-- Table: messages
CREATE TABLE messages (
    id varchar(50)  NOT NULL,
    content varchar(500)  NOT NULL,
    create_time timestamp  NOT NULL,
    user_id int  NOT NULL,
    group_id int  NOT NULL,
    CONSTRAINT Message_uk_01 UNIQUE (user_id, create_time) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT messages_pk PRIMARY KEY (id)
);

CREATE INDEX messages_idx_1 on messages (group_id DESC);

-- Table: notification_receivers
CREATE TABLE notification_receivers (
    notification_id int  NOT NULL,
    receiver_id int  NOT NULL,
    CONSTRAINT notification_receivers_pk PRIMARY KEY (notification_id,receiver_id)
);

-- Table: notifications
CREATE TABLE notifications (
    id serial  NOT NULL,
    content varchar(500)  NOT NULL,
    created_date timestamp  NOT NULL,
    sender_id int  NOT NULL,
    is_read boolean  NOT NULL,
    CONSTRAINT notifications_pk PRIMARY KEY (id)
);

-- Table: organizations
CREATE TABLE organizations (
    abbreviation varchar(10)  NOT NULL,
    name varchar(80)  NOT NULL,
    address varchar(200)  NOT NULL,
    start_date date  NOT NULL,
    CONSTRAINT Organization_uk_01 UNIQUE (name, address) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT organizations_pk PRIMARY KEY (abbreviation)
);

-- Table: participants
CREATE TABLE participants (
    joined_at date  NOT NULL,
    user_id int  NOT NULL,
    group_id int  NOT NULL,
    last_active_time timestamp  NULL,
    CONSTRAINT participants_pk PRIMARY KEY (user_id,group_id)
);

CREATE INDEX participants_idx_1 on participants (group_id ASC);

-- Table: request
CREATE TABLE request (
    id serial  NOT NULL,
    schedules_id int  NOT NULL,
    status varchar(20)  NOT NULL,
    reason varchar(200)  NOT NULL,
    request_time timestamp  NOT NULL,
    manager_id int  NULL,
    approved_time timestamp  NULL,
    employee_id int  NOT NULL,
    CONSTRAINT request_pk PRIMARY KEY (id)
);

-- Table: roles
CREATE TABLE roles (
    name varchar(80)  NOT NULL,
    description varchar(200)  NOT NULL,
    org_abbreviation varchar(10)  NOT NULL,
    CONSTRAINT roles_pk PRIMARY KEY (name,org_abbreviation)
);

-- Table: roleshifts
CREATE TABLE roleshifts (
    role_name varchar(80)  NOT NULL,
    org_abbreviation varchar(10)  NOT NULL,
    shift_id int  NOT NULL,
    quantity int  NOT NULL,
    CONSTRAINT roleshifts_pk PRIMARY KEY (shift_id,role_name)
);

-- Table: schedules
CREATE TABLE schedules (
    id serial  NOT NULL,
    emp_id int  NOT NULL,
    start_time timestamp  NOT NULL,
    end_time timestamp  NOT NULL,
    create_at timestamp  NOT NULL,
    shift_id int  NOT NULL,
    CONSTRAINT schedules_pk PRIMARY KEY (id)
);

-- Table: shifts
CREATE TABLE shifts (
    id serial  NOT NULL,
    day_of_week varchar(20)  NOT NULL,
    start_time time  NOT NULL,
    end_time time  NOT NULL,
    org_abbreviation varchar(10)  NOT NULL,
    CONSTRAINT shifts_uk_1 UNIQUE (day_of_week, start_time, end_time, org_abbreviation) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT shifts_pk PRIMARY KEY (id)
);

-- Table: timesheets
CREATE TABLE timesheets (
    clock_in timestamp  NOT NULL,
    clock_out timestamp  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT timesheets_pk PRIMARY KEY (clock_in,emp_id)
);

-- Table: users
CREATE TABLE users (
    id serial  NOT NULL,
    email varchar(120)  NOT NULL,
    password varchar(80)  NOT NULL,
    last_name varchar(80)  NOT NULL,
    first_name varchar(80)  NOT NULL,
    phone_number varchar(10)  NOT NULL,
    date_of_birth date  NOT NULL,
    avatar varchar(200)  NULL,
    expo_push_token varchar(200)  NULL,
    CONSTRAINT User_uk_01 UNIQUE (email) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT User_uk_02 UNIQUE (phone_number) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT users_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: AvailableTime_Employee (table: availabletimes)
ALTER TABLE availabletimes ADD CONSTRAINT AvailableTime_Employee
    FOREIGN KEY (employee_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Employee_User (table: employees)
ALTER TABLE employees ADD CONSTRAINT Employee_User
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Feedback_Employee (table: feedbacks)
ALTER TABLE feedbacks ADD CONSTRAINT Feedback_Employee
    FOREIGN KEY (emp_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Message_User (table: messages)
ALTER TABLE messages ADD CONSTRAINT Message_User
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Notification_Employee (table: notifications)
ALTER TABLE notifications ADD CONSTRAINT Notification_Employee
    FOREIGN KEY (sender_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Participant_Group (table: participants)
ALTER TABLE participants ADD CONSTRAINT Participant_Group
    FOREIGN KEY (group_id)
    REFERENCES groups (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Participant_User (table: participants)
ALTER TABLE participants ADD CONSTRAINT Participant_User
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Schedule_Employee (table: schedules)
ALTER TABLE schedules ADD CONSTRAINT Schedule_Employee
    FOREIGN KEY (emp_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Table_25_roles (table: roleshifts)
ALTER TABLE roleshifts ADD CONSTRAINT Table_25_roles
    FOREIGN KEY (role_name, org_abbreviation)
    REFERENCES roles (name, org_abbreviation)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Table_25_shifts (table: roleshifts)
ALTER TABLE roleshifts ADD CONSTRAINT Table_25_shifts
    FOREIGN KEY (shift_id)
    REFERENCES shifts (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: TimeSheet_Employee (table: timesheets)
ALTER TABLE timesheets ADD CONSTRAINT TimeSheet_Employee
    FOREIGN KEY (emp_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: employees_roles (table: employees)
ALTER TABLE employees ADD CONSTRAINT employees_roles
    FOREIGN KEY (role_name, org_abbreviation)
    REFERENCES roles (name, org_abbreviation)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: exchange_employees (table: exchange)
ALTER TABLE exchange ADD CONSTRAINT exchange_employees
    FOREIGN KEY (employee_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: exchange_request (table: exchange)
ALTER TABLE exchange ADD CONSTRAINT exchange_request
    FOREIGN KEY (request_id)
    REFERENCES request (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: exchange_schedules (table: exchange)
ALTER TABLE exchange ADD CONSTRAINT exchange_schedules
    FOREIGN KEY (schedules_id)
    REFERENCES schedules (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: messages_groups (table: messages)
ALTER TABLE messages ADD CONSTRAINT messages_groups
    FOREIGN KEY (group_id)
    REFERENCES groups (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: notification_receivers_employees (table: notification_receivers)
ALTER TABLE notification_receivers ADD CONSTRAINT notification_receivers_employees
    FOREIGN KEY (receiver_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: notification_receivers_notifications (table: notification_receivers)
ALTER TABLE notification_receivers ADD CONSTRAINT notification_receivers_notifications
    FOREIGN KEY (notification_id)
    REFERENCES notifications (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: request_employees (table: request)
ALTER TABLE request ADD CONSTRAINT request_employees
    FOREIGN KEY (employee_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: request_managers (table: request)
ALTER TABLE request ADD CONSTRAINT request_managers
    FOREIGN KEY (manager_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: request_schedules (table: request)
ALTER TABLE request ADD CONSTRAINT request_schedules
    FOREIGN KEY (schedules_id)
    REFERENCES schedules (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: roles_organizations (table: roles)
ALTER TABLE roles ADD CONSTRAINT roles_organizations
    FOREIGN KEY (org_abbreviation)
    REFERENCES organizations (abbreviation)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: schedules_shifts (table: schedules)
ALTER TABLE schedules ADD CONSTRAINT schedules_shifts
    FOREIGN KEY (shift_id)
    REFERENCES shifts (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: shifts_organizations (table: shifts)
ALTER TABLE shifts ADD CONSTRAINT shifts_organizations
    FOREIGN KEY (org_abbreviation)
    REFERENCES organizations (abbreviation)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

