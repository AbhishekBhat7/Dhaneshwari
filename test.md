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



<!-- CREATE TABLE client (
    user_id bigint PRIMARY KEY,
    name character varying,
    email character varying(255) UNIQUE,
    password character varying,
    firebase_id character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
); -->
CREATE TABLE client (
    user_id BIGSERIAL PRIMARY KEY,
    name character varying,
    email character varying(255) UNIQUE,
    password character varying,
    firebase_id character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_client_email ON client(email);
CREATE INDEX idx_client_name ON client(name);



CREATE TABLE partners1 (
    partner_id BIGSERIAL PRIMARY KEY,
     email character varying(255) ,
    name character varying,
    contact_number character varying(15),
    adhaar_number character varying(12) UNIQUE,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
   
);

CREATE INDEX idx_partners1_adhaar ON partners1(adhaar_number);
CREATE INDEX idx_partners1_name ON partners1(name);
