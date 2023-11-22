export interface GoogleAuthCredentials {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

export interface DBConfig {
  name: string;
  host: string;
  password: string;
  port: number;
  ssl: boolean;
  username: string;
}

interface ConfigVars {
  database: DBConfig;
  jwt: {
    auth_secret: string;
    secret: string;
  };
  oauth: {
    google: GoogleAuthCredentials;
  };
  frontend: {
    base_url: string;
  };
}

export default ConfigVars;
