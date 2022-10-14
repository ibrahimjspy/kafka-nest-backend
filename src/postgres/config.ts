import { Client } from 'pg';

const client = new Client({
  host: 'localhost', // Postgres ip address[s] or domain name[s]
  port: 5433, // Postgres server port[s]
  database: 'sharove', // Name of database to connect to
  user: 'sharove', // Username of database user
  password: 'sharove', // Password of database user
});

client.connect();
export default client;
