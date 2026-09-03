import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, ".watchdog-idle-since");

const APP_PORT = process.env.PORT || 8080;
const IDLE_THRESHOLD_MINUTES = Number(process.env.WATCHDOG_IDLE_MINUTES || 1);
const STOP_URL = process.env.EC2_MANAGER_STOP_URL || "https://hivemindbotec2manager.vercel.app/ec2/stop";

function countActiveConnections() {
    return new Promise((resolve, reject) => {
        exec(
            `ss -tn state established '( dport = :${APP_PORT} or sport = :${APP_PORT} )' | tail -n +2 | wc -l`,
            (error, stdout) => {
                if (error) return reject(error);
                resolve(parseInt(stdout.trim(), 10) || 0);
            }
        );
    });
}

function readIdleSince() {
    try {
        return parseInt(fs.readFileSync(STATE_FILE, "utf8"), 10);
    } catch {
        return null;
    }
}

function writeIdleSince(value) {
    if (value === null) {
        fs.rmSync(STATE_FILE, { force: true });
    } else {
        fs.writeFileSync(STATE_FILE, String(value));
    }
}

async function main() {
    const activeConnections = await countActiveConnections();
    console.log(`[watchdog] active connections on port ${APP_PORT}: ${activeConnections}`);

    if (activeConnections > 0) {
        writeIdleSince(null);
        console.log("[watchdog] activity detected, idle timer reset");
        return;
    }

    let idleSince = readIdleSince();
    if (!idleSince) {
        writeIdleSince(Date.now());
        console.log("[watchdog] no activity, starting idle timer");
        return;
    }

    const idleMinutes = (Date.now() - idleSince) / 60000;
    console.log(`[watchdog] idle for ${idleMinutes.toFixed(1)} minute(s), threshold is ${IDLE_THRESHOLD_MINUTES}`);

    if (idleMinutes < IDLE_THRESHOLD_MINUTES) {
        return;
    }

    console.log("[watchdog] idle threshold reached, requesting EC2 stop");
    try {
        const resp = await fetch(STOP_URL, { method: "POST" });
        console.log(`[watchdog] stop request sent, status ${resp.status}`);
        writeIdleSince(null);
    } catch (error) {
        console.error("[watchdog] failed to request stop, will retry next run:", error.message);
    }
}

main().catch((error) => {
    console.error("[watchdog] unexpected error:", error.message);
});
