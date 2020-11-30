CREATE DOMAIN url AS
   VARCHAR NOT NULL CHECK (value ~ 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)');

CREATE TYPE mode AS ENUM ('subscribe', 'unsubscribe');

CREATE TYPE status AS ENUM ('pending', 'success', 'failed');


CREATE TABLE topics (
	id serial PRIMARY KEY,
	name text,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscribers (
	id serial,
	callback_url VARCHAR (100) UNIQUE NOT NULL,
	topic VARCHAR ( 50 ) NOT NULL,
	topic_id INT NOT NULL,
	status mode,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS my_subscriptions;
CREATE TABLE my_subscriptions (
	id serial PRIMARY KEY,
	topic_name text UNIQUE NOT NULL,
	status status,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP
);

CREATE TABLE updates (
	id serial PRIMARY KEY,
	topic_name text UNIQUE NOT NULL,
	message text,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO topics (name) VALUES ('topic1');
INSERT INTO topics (name) VALUES ('topic2');
INSERT INTO topics (name) VALUES ('topic3');
INSERT INTO topics (name) VALUES ('topic4');
INSERT INTO topics (name) VALUES ('topic5');

