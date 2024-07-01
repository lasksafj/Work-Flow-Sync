-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-06-26 01:46:06.18

-- tables
-- Table: AvailableTime
CREATE TABLE AvailableTime (
    id int  NOT NULL,
    start_time date  NOT NULL,
    end_time date  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT AvailableTime_pk PRIMARY KEY (id)
);

-- Table: Employee
CREATE TABLE Employee (
    id int  NOT NULL,
    pay_rate decimal(3,2)  NOT NULL,
    org_id int  NOT NULL,
    role_name varchar(80)  NOT NULL,
    user_id int  NOT NULL,
    CONSTRAINT Employee_pk PRIMARY KEY (id)
);

-- Table: Feedback
CREATE TABLE Feedback (
    id int  NOT NULL,
    content varchar(500)  NOT NULL,
    created_date date  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT Feedback_pk PRIMARY KEY (id)
);

-- Table: Group
CREATE TABLE "Group" (
    id int  NOT NULL,
    name varchar(80)  NOT NULL,
    created_at date  NOT NULL,
    CONSTRAINT Group_pk PRIMARY KEY (id)
);

-- Table: Message
CREATE TABLE Message (
    id int  NOT NULL,
    content varchar(500)  NOT NULL,
    create_time date  NOT NULL,
    user_id int  NOT NULL,
    CONSTRAINT Message_pk PRIMARY KEY (id)
);

-- Table: MessageGroup
CREATE TABLE MessageGroup (
    group_id int  NOT NULL,
    mes_id int  NOT NULL,
    CONSTRAINT MessageGroup_pk PRIMARY KEY (group_id,mes_id)
);

-- Table: Notification
CREATE TABLE Notification (
    id int  NOT NULL,
    content int  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT Notification_pk PRIMARY KEY (id)
);

-- Table: Organization
CREATE TABLE Organization (
    id int  NOT NULL,
    name varchar(80)  NOT NULL,
    address varchar(200)  NOT NULL,
    CONSTRAINT Organization_pk PRIMARY KEY (id)
);

-- Table: Participant
CREATE TABLE Participant (
    joined_at date  NOT NULL,
    user_id int  NOT NULL,
    group_id int  NOT NULL,
    CONSTRAINT Participant_pk PRIMARY KEY (user_id,group_id)
);

-- Table: Role
CREATE TABLE Role (
    name varchar(80)  NOT NULL,
    description varchar(200)  NOT NULL,
    CONSTRAINT Role_pk PRIMARY KEY (name)
);

-- Table: Schedule
CREATE TABLE Schedule (
    id int  NOT NULL,
    start_time date  NOT NULL,
    end_time date  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT Schedule_pk PRIMARY KEY (id)
);

-- Table: Status
CREATE TABLE Status (
    is_seen boolean  NOT NULL,
    mes_id int  NOT NULL,
    user_id int  NOT NULL,
    group_id int  NOT NULL,
    CONSTRAINT Status_pk PRIMARY KEY (group_id,user_id,mes_id)
);

-- Table: TimeSheet
CREATE TABLE TimeSheet (
    clock_in date  NOT NULL,
    clock_out date  NOT NULL,
    emp_id int  NOT NULL,
    CONSTRAINT TimeSheet_pk PRIMARY KEY (clock_in,clock_out)
);

-- Table: User
CREATE TABLE "User" (
    id int  NOT NULL,
    email varchar(120)  NOT NULL,
    password varchar(80)  NOT NULL,
    last_name varchar(80)  NOT NULL,
    first_name varchar(80)  NOT NULL,
    phone_number varchar(10)  NOT NULL,
    date_of_birth date  NOT NULL,
    CONSTRAINT User_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: AvailableTime_Employee (table: AvailableTime)
ALTER TABLE AvailableTime ADD CONSTRAINT AvailableTime_Employee
    FOREIGN KEY (emp_id)
    REFERENCES Employee (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Employee_Organization (table: Employee)
ALTER TABLE Employee ADD CONSTRAINT Employee_Organization
    FOREIGN KEY (org_id)
    REFERENCES Organization (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Employee_Role (table: Employee)
ALTER TABLE Employee ADD CONSTRAINT Employee_Role
    FOREIGN KEY (role_name)
    REFERENCES Role (name)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Employee_User (table: Employee)
ALTER TABLE Employee ADD CONSTRAINT Employee_User
    FOREIGN KEY (user_id)
    REFERENCES "User" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Feedback_Employee (table: Feedback)
ALTER TABLE Feedback ADD CONSTRAINT Feedback_Employee
    FOREIGN KEY (emp_id)
    REFERENCES Employee (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: MessageGroup_Group (table: MessageGroup)
ALTER TABLE MessageGroup ADD CONSTRAINT MessageGroup_Group
    FOREIGN KEY (group_id)
    REFERENCES "Group" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: MessageGroup_Message (table: MessageGroup)
ALTER TABLE MessageGroup ADD CONSTRAINT MessageGroup_Message
    FOREIGN KEY (mes_id)
    REFERENCES Message (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Message_User (table: Message)
ALTER TABLE Message ADD CONSTRAINT Message_User
    FOREIGN KEY (user_id)
    REFERENCES "User" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Notification_Employee (table: Notification)
ALTER TABLE Notification ADD CONSTRAINT Notification_Employee
    FOREIGN KEY (emp_id)
    REFERENCES Employee (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Participant_Group (table: Participant)
ALTER TABLE Participant ADD CONSTRAINT Participant_Group
    FOREIGN KEY (group_id)
    REFERENCES "Group" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Participant_User (table: Participant)
ALTER TABLE Participant ADD CONSTRAINT Participant_User
    FOREIGN KEY (user_id)
    REFERENCES "User" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Schedule_Employee (table: Schedule)
ALTER TABLE Schedule ADD CONSTRAINT Schedule_Employee
    FOREIGN KEY (emp_id)
    REFERENCES Employee (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Status_Message (table: Status)
ALTER TABLE Status ADD CONSTRAINT Status_Message
    FOREIGN KEY (mes_id)
    REFERENCES Message (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Status_Participant (table: Status)
ALTER TABLE Status ADD CONSTRAINT Status_Participant
    FOREIGN KEY (user_id, group_id)
    REFERENCES Participant (user_id, group_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: TimeSheet_Employee (table: TimeSheet)
ALTER TABLE TimeSheet ADD CONSTRAINT TimeSheet_Employee
    FOREIGN KEY (emp_id)
    REFERENCES Employee (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

