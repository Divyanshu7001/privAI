const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

// Parse the connection string to connect to default database for DB creation
const defaultConnectionString = connectionString.replace(/\/privAI(\?.*)?$/, "/postgres$1");

const defaultPool = new Pool({
  connectionString: defaultConnectionString,
});

const pool = new Pool({
  connectionString: connectionString,
});

const initializeDatabase = async () => {
  try {
    // 1. Check if database exists, if not create it
    console.log("[db] Checking if database 'privAI' exists...");
    const checkDbResult = await defaultPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'privAI'"
    );

    if (checkDbResult.rows.length === 0) {
      console.log("[db] Database 'privAI' not found. Creating it...");
      // CREATE DATABASE cannot run inside a transaction block, so we run it directly
      await defaultPool.query('CREATE DATABASE "privAI"');
      console.log("[db] Database 'privAI' created successfully.");
    } else {
      console.log("[db] Database 'privAI' already exists.");
    }
  } catch (err) {
    console.error("[db] Error checking/creating database:", err);
  } finally {
    // End default pool connection
    await defaultPool.end();
  }

  // 2. Connect to the application database and create tables
  try {
    console.log("[db] Connecting to 'privAI' database to initialize tables...");
    
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        work_email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        personal_emails TEXT[] DEFAULT '{}',
        phones TEXT[] DEFAULT '{}',
        personal_address JSONB,
        work_address JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Exceptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exceptions (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        name BOOLEAN DEFAULT TRUE,
        personal_email BOOLEAN DEFAULT TRUE,
        work_email BOOLEAN DEFAULT FALSE,
        phone BOOLEAN DEFAULT FALSE,
        work_address BOOLEAN DEFAULT FALSE,
        custom TEXT[] DEFAULT '{}'
      );
    `);

    // Flagged posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS flagged_posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        pii_remarks TEXT NOT NULL,
        post_title TEXT NOT NULL,
        user_action VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("[db] Database tables initialized successfully.");
  } catch (err) {
    console.error("[db] Error initializing tables:", err);
    throw err;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initializeDatabase,
};
