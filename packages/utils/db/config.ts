import mysql from "mysql2/promise";

declare global {
  var db: mysql.Pool
}

const db = globalThis.db || mysql.createPool({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default db;

if (process.env.NODE_ENV !== "production") globalThis.db = db;