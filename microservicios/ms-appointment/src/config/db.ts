import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'

dotenv.config()

const dbName = process.env.DB_NAME || 'health_db';
const dbUser = process.env.DB_USER || 'xxxx';
const dbPassword = process.env.DB_PASSWORD || 'xxxx';
const dbHost = process.env.DB_HOST || 'xxxx';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;

const db = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
  },
  define: {
    schema: 'public'
  },
  logging: false
});

export default db