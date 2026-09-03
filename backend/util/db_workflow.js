import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export async function uploadWorkflow(tab, logs) {
    let connection;

    try {
        const connection = await mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database,
            ssl: {
                minVersion: "TLSv1.2",
                rejectUnauthorized: true
            }
        });

        const query = `
            INSERT INTO workflows (id, tab, logs)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                tab = VALUES(tab),
                logs = VALUES(logs)
        `;

        const [result] = await connection.execute(query, [
            tab.id,
            JSON.stringify(tab),
            JSON.stringify(logs)
        ]);

        console.log("workflow uploaded successfully");

        return result;

    } catch (err) {
        console.error("error uploading workflow:", err);
        throw err;

    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export default async function getAllWorkflows() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database,
            ssl: {
                minVersion: "TLSv1.2",
                rejectUnauthorized: true
            }
        });

        const [rows] = await connection.execute(`
            SELECT *
            FROM workflows
            ORDER BY updated_at DESC
        `);

        return rows;

    } catch (err) {
        console.log(err);
        console.log("error in getting workflows");
        return err;

    } finally {
        if (connection) {
            await connection.end();
        }
    }
}