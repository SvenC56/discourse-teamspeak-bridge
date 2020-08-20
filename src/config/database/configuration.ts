import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  name: process.env.DATABASE_NAME || 'sync',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: [__dirname + '/../../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../../database/migrations/*.{js,ts}'],
  subscribers: [__dirname + '/../../database/subscriber/*.{js,ts}'],
}));