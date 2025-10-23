"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_js_1 = __importDefault(require("../config/dbConfig.js"));
const sequelize = new sequelize_1.Sequelize(dbConfig_js_1.default.database, dbConfig_js_1.default.user, dbConfig_js_1.default.password, {
    host: dbConfig_js_1.default.host,
    dialect: dbConfig_js_1.default.dialect,
    port: dbConfig_js_1.default.port,
    pool: {
        max: dbConfig_js_1.default.pool.max,
        min: dbConfig_js_1.default.pool.min,
        idle: dbConfig_js_1.default.pool.idle,
        acquire: dbConfig_js_1.default.pool.acquire,
    },
});
sequelize.authenticate()
    .then(() => {
    console.log("Database connected successfully.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
const db = {};
db.Sequelize = sequelize_1.Sequelize;
db.sequelize = sequelize;
db.sequelize.sync({ force: true }).then(() => {
    console.log("All models were synchronized successfully.");
});
exports.default = db;
