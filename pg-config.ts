import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();
// postgres configurations to establish connection
const client = new Client({
  host: process.env.POSTGRES_HOST, // Postgres ip address[s] or domain name[s]
  port: process.env.POSTGRES_PORT, // Postgres server port[s]
  database: process.env.POSTGRES_DATABASE, // Name of database to connect to
  user: process.env.POSTGRES_USER, // Username of database user
  password: process.env.POSTGRES_PASSWORD, // Password of database user
});
try {
  client.connect();
} catch (error) {
  Logger.warn(`Postgres connection failed ${process.env.POSTGRES_PORT}`);
}
export default client;
