--liquibase formatted sql

--changeset felix:1
create table Configuration (
    nPlayers int,
    nTasks int
)
--rollback drop table Configuration;

--changeset felix:2
insert into Configuration (nPlayers, nTasks) values (2, 20)

--changeset felix:3
create table Task (
    id int auto_increment primary key,
    name varchar(100),
    description varchar(255),
    level int
);
--rollback drop table Task;

--changeset felix:4
insert into Task (name, description, level) values ('Contar historia', 'Contar historia', 1)
