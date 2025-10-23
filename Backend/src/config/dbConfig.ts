type databaseType = {
  host: string;
  user: string;
  port: number;
  password: string;
  database: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mssql';
  pool: {
    max: number;
    min: number;
    idle: number;
    acquire: number;
  }
};

const databaseConfig: databaseType = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'Ts_database',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000
  }
};

export default databaseConfig;