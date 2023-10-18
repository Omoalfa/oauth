


import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { config } from 'dotenv';
import ConfigVars, { DBConfig } from './interface';

config();

const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;
const bool = (val: string | undefined, bool: boolean): boolean =>
  val == null ? bool : val == 'true';

const getDbConfig = (): DBConfig => {
  if (process.env.NODE_ENV === "test") {
    return {
      host: process.env.TEST_DB_HOST || "localhost",
      password: process.env.TEST_DB_PASS,
      port: int(process.env.TEST_DB_PORT, 5432),
      ssl: bool(process.env.TEST_DB_SSL, true),
      name: process.env.TEST_DB_NAME,
      username: process.env.TEST_DB_USER,
    }
  } 
  return {
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASS,
    port: int(process.env.DB_PORT, 5432),
    ssl: bool(process.env.DB_SSL, true),
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
  }
}

const configuration: ConfigVars = {
  database: getDbConfig(),
  jwt: {
    secret: process.env.JWT_SECRET || 'seKOENVOEINLND234NFI',
    auth_secret: process.env.JWT_AUTH_SECRET || 'seKOENVOEINLND234ERIV84HR'
  },
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL + process.env.GOOGLE_CALLBACK_URL,
    }
  },
  frontend: {
    base_url: process.env.CLIENT_URL || "http://localhost:3000"
  }
};

const configFunction: ConfigFactory<ConfigVars> = () => configuration;
export default configFunction;
