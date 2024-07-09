-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-07-09 23:12:54.759

-- tables
-- Table: availabletimes
CREATE TABLE availabletimes (
    start_time date  NOT NULL,
    end_time date  NOT NULL,
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
    CONSTRAINT Employee_uk_01 UNIQUE (employee_number, user_id, org_abbreviation) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT employees_pk PRIMARY KEY (id)
);

-- Table: feedbacks
CREATE TABLE feedbacks (
    content varchar(500)  NOT NULL,
    created_date date  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT feedbacks_pk PRIMARY KEY (created_date,emp_id)
);

-- Table: groups
CREATE TABLE groups (
    id serial  NOT NULL,
    name varchar(80)  NOT NULL,
    created_at date  NOT NULL,
    CONSTRAINT groups_pk PRIMARY KEY (id)
);

-- Table: messages
CREATE TABLE messages (
    id serial  NOT NULL,
    content varchar(500)  NOT NULL,
    create_time date  NOT NULL,
    user_id int  NOT NULL,
    group_id int  NOT NULL,
    CONSTRAINT Message_uk_01 UNIQUE (user_id, create_time) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT messages_pk PRIMARY KEY (id)
);

-- Table: notifications
CREATE TABLE notifications (
    content int  NOT NULL,
    created_date date  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT notifications_pk PRIMARY KEY (created_date,emp_id)
);

-- Table: organizations
CREATE TABLE organizations (
    abbreviation varchar(10)  NOT NULL,
    name varchar(80)  NOT NULL,
    address varchar(200)  NOT NULL,
    CONSTRAINT Organization_uk_01 UNIQUE (name, address) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT organizations_pk PRIMARY KEY (abbreviation)
);

-- Table: participants
CREATE TABLE participants (
    joined_at date  NOT NULL,
    user_id int  NOT NULL,
    group_id int  NOT NULL,
    CONSTRAINT participants_pk PRIMARY KEY (user_id,group_id)
);

-- Table: roles
CREATE TABLE roles (
    name varchar(80)  NOT NULL,
    description varchar(200)  NOT NULL,
    CONSTRAINT roles_pk PRIMARY KEY (name)
);

-- Table: schedules
CREATE TABLE schedules (
    start_time date  NOT NULL,
    end_time date  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT schedules_pk PRIMARY KEY (end_time,start_time)
);

-- Table: statuses
CREATE TABLE statuses (
    is_seen boolean  NOT NULL,
    mes_id int  NOT NULL,
    user_id int  NOT NULL,
    group_id int  NOT NULL,
    CONSTRAINT statuses_pk PRIMARY KEY (group_id,user_id,mes_id)
);

-- Table: timesheets
CREATE TABLE timesheets (
    clock_in date  NOT NULL,
    clock_out date  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT timesheets_pk PRIMARY KEY (clock_in,clock_out)
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
    FOREIGN KEY (emp_id)
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

-- Reference: Status_Message (table: statuses)
ALTER TABLE statuses ADD CONSTRAINT Status_Message
    FOREIGN KEY (mes_id)
    REFERENCES messages (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Status_Participant (table: statuses)
ALTER TABLE statuses ADD CONSTRAINT Status_Participant
    FOREIGN KEY (user_id, group_id)
    REFERENCES participants (user_id, group_id)  
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

-- End of file.

