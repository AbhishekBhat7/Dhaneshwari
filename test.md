CREATE TABLE users (
    user_id bigint NOT NULL  ,
    email character varying NOT NULL,
    password character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email)
);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE partners (
    partner_id bigint PRIMARY KEY 
    name character varying,
    contact_number character varying(15),
    adhaar_number character varying(12) UNIQUE,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(255),
    firebase_uid character varying(255)
);
 
CREATE INDEX idx_partners_adhaar ON partners(adhaar_number);
CREATE INDEX idx_partners_name ON partners(name);
