-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-08-21 23:16:21.881

-- tables
-- Table: availabletimes
CREATE TABLE availabletimes (
    start_time timestamp  NOT NULL,
    end_time timestamp  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT availabletimes_pk PRIMARY KEY (emp_id,end_time,start_time)
);

-- Table: employees
CREATE TABLE employees (
    id serial  NOT NULL,
    employee_number int  NOT NULL,
    pay_rate decimal(7,2)  NOT NULL,
    role_name varchar(80)  NOT NULL,
    user_id int  NOT NULL,
    org_abbreviation varchar(10)  NOT NULL,
    CONSTRAINT Employee_uk_01 UNIQUE (user_id, org_abbreviation, role_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT employees_ak_2 UNIQUE (org_abbreviation, employee_number) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT employees_pk PRIMARY KEY (id)
);

CREATE INDEX employees_idx_1 on employees (user_id ASC);

CREATE INDEX employees_idx_2 on employees (org_abbreviation ASC);

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

-- Table: roles
CREATE TABLE roles (
    name varchar(80)  NOT NULL,
    description varchar(200)  NOT NULL,
    CONSTRAINT roles_pk PRIMARY KEY (name)
);

-- Table: schedules
CREATE TABLE schedules (
    start_time timestamp  NOT NULL,
    end_time timestamp  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT schedules_pk PRIMARY KEY (end_time,start_time,emp_id)
);

-- Table: timesheets
CREATE TABLE timesheets (
    clock_in timestamp  NOT NULL,
    clock_out timestamp  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT timesheets_pk PRIMARY KEY (clock_in,clock_out,emp_id)
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
    CONSTRAINT User_uk_01 UNIQUE (email) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT User_uk_02 UNIQUE (phone_number) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT users_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: AvailableTime_Employee (table: availabletimes)
ALTER TABLE availabletimes ADD CONSTRAINT AvailableTime_Employee
    FOREIGN KEY (emp_id)
    REFERENCES employees (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Employee_Organization (table: employees)
ALTER TABLE employees ADD CONSTRAINT Employee_Organization
    FOREIGN KEY (org_abbreviation)
    REFERENCES organizations (abbreviation)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Employee_Role (table: employees)
ALTER TABLE employees ADD CONSTRAINT Employee_Role
    FOREIGN KEY (role_name)
    REFERENCES roles (name)  
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

-- Reference: TimeSheet_Employee (table: timesheets)
ALTER TABLE timesheets ADD CONSTRAINT TimeSheet_Employee
    FOREIGN KEY (emp_id)
    REFERENCES employees (id)  
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

-- End of file.

