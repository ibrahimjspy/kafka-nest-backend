import { Client } from 'pg';

const client = new Client({
  host: 'localhost', // Postgres ip address[s] or domain name[s]
  port: 5432, // Postgres server port[s]
  database: 'saleor', // Name of database to connect to
  user: 'saleor', // Username of database user
  password: 'saleor', // Password of database user
});

client.connect();
export default client;
