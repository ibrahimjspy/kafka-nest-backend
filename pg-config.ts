import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();
const POSTGRES_HOST = process.env.POSTGRES_HOST;
// postgres configurations to establish connection
const client = new Client({
  host: POSTGRES_HOST, // Postgres ip address[s] or domain name[s]
  port: process.env.POSTGRES_PORT, // Postgres server port[s]
  database: process.env.POSTGRES_DATABASE, // Name of database to connect to
  user: process.env.POSTGRES_USER, // Username of database user
  password: process.env.POSTGRES_PASSWORD, // Password of database user
});
try {
  Logger.log('connecting to postgres');
  Logger.log(POSTGRES_HOST);
  client.connect();
} catch (error) {
  Logger.warn(`Postgres connection failed ${process.env.POSTGRES_PORT}`);
}
export default client;
