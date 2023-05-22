import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true,
  },
};
