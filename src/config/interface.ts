
export interface GoogleAuthCredentials {
  clientID: string,
  clientSecret: string,
  callbackURL: string,
}

export interface DBConfig {
  name: string,
  host: string,
  password: string,
  port: number,
  ssl: boolean,
  username: string,
}

interface ConfigVars {
  database: DBConfig,
  jwt: {
    secret: string,
  },
  oauth: {
    google: GoogleAuthCredentials,
  },
}

export default ConfigVars;
