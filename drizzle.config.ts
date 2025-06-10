import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './src/schema',
  out: './drizzle',
  dialect: 'mysql',
dbCredentials: {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: undefined,
  database: 'mini_thinking'
}
};

export default config;