"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databaseConfig = {
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
exports.default = databaseConfig;
