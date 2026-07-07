import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

// Read SQL file
const sqlFilePath = path.join(__dirname, "..", "supabase-schema.sql");
const sql = fs.readFileSync(sqlFilePath, "utf8");

// We try both password options (with and without brackets) to be safe
const passwordOptions = ["OpenShelfProject@123", "[OpenShelfProject@123]"];
const host = "db.xarlypmjrwtzltkxquxu.supabase.co";
const user = "postgres";
const database = "postgres";
const port = 5432;

async function runMigration() {
  let client = null;
  let connected = false;

  for (const password of passwordOptions) {
    console.log(`Connecting to database with password option: "${password}"...`);
    try {
      client = new Client({
        user,
        host,
        database,
        password,
        port,
        ssl: {
          rejectUnauthorized: false
        }
      });
      await client.connect();
      connected = true;
      console.log("✅ Successfully connected to Supabase PostgreSQL!");
      break;
    } catch (err) {
      console.log(`❌ Connection failed with password "${password}":`, err.message);
    }
  }

  if (!connected) {
    console.error("⛔ Could not connect to the database with any password options. Please verify your database password.");
    process.exit(1);
  }

  try {
    console.log("⏳ Running database schema initialization...");
    
    // We execute the SQL file
    await client.query(sql);
    
    console.log("🎉 Database schema and seed data loaded successfully!");
  } catch (err) {
    console.error("❌ Error executing database script:", err.message);
  } finally {
    await client.end();
  }
}

runMigration();
