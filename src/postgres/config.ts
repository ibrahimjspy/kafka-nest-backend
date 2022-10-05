import { Client } from 'pg';

const client = new Client({
  host: process.env.POSTGRES_HOST, // Postgres ip address[s] or domain name[s]
  port: process.env.POSTGRES_PORT, // Postgres server port[s]
  database: process.env.POSTGRES_DATABASE, // Name of database to connect to
  user: process.env.POSTGRES_USER, // Username of database user
  password: process.env.POSTGRES_PASSWORD, // Password of database user
});

client.connect();
export default client;
