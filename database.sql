CREATE TABLE todo(
	id serial primary key,
	task varchar(280),
  completed varchar(10),
  calendar varchar(20),
  duedate varchar(10)
);

CREATE TABLE calendars(
	calendar_id serial primary key,
	calendar_name varchar(20),
  color varchar(20)
);
