import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up MySQL connection to XAMPP (default: host=localhost, user=root, password=empty)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inner_circle',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

/* --- API ROUTES --- */

// Initialize Database & Seed (Automatically called on frontend boot)
app.post('/api/init', async (req, res) => {
    try {
        const conn = await pool.getConnection();

        await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      role ENUM('super_admin', 'admin', 'investor') DEFAULT 'investor',
      full_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

        await conn.query(`CREATE TABLE IF NOT EXISTS investors (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) UNIQUE,
      join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

        await conn.query(`CREATE TABLE IF NOT EXISTS transactions (
      id VARCHAR(36) PRIMARY KEY,
      investor_id VARCHAR(36),
      type ENUM('deposit', 'withdrawal', 'profit') NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      description TEXT,
      created_by VARCHAR(36),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )`);

        // Seed P3L Trader and Razak Wako if not exists
        const [rows] = await conn.query('SELECT * FROM users');
        if (rows.length === 0) {
            const adminId = uuidv4();
            const adminHash = await bcrypt.hash('Guyesa_10333', 10);
            await conn.query('INSERT INTO users (id, role, full_name, email, password) VALUES (?, ?, ?, ?, ?)',
                [adminId, 'admin', 'P3L Trader', 'trader@p3l.com', adminHash]);

            const investorId = uuidv4();
            const invHash = await bcrypt.hash('guyesa10333', 10);
            await conn.query('INSERT INTO users (id, role, full_name, email, password) VALUES (?, ?, ?, ?, ?)',
                [investorId, 'investor', 'Razak Wako', 'razak@innercircle.com', invHash]);

            const invProfileId = uuidv4();
            await conn.query('INSERT INTO investors (id, user_id) VALUES (?, ?)', [invProfileId, investorId]);
        }

        conn.release();
        res.json({ message: 'Database schema created & fully seeded!' });
    } catch (err) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            res.status(500).json({ error: 'Database inner_circle does not exist yet. Please create it in phpMyAdmin first!' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        // Remove password hash from memory
        delete user.password;

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Current User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, role, full_name, email, phone, status, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ user: users[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List All Investors
app.get('/api/investors', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT i.id, i.user_id, i.join_date, i.created_at, 
             u.full_name, u.email, u.phone, u.status 
      FROM investors i 
      JOIN users u ON i.user_id = u.id
    `);

        // Format to match old Supabase schema
        const investors = rows.map(r => ({
            id: r.id,
            user_id: r.user_id,
            join_date: r.join_date,
            created_at: r.created_at,
            user: {
                full_name: r.full_name,
                email: r.email,
                phone: r.phone,
                status: r.status
            }
        }));
        res.json(investors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List All Transactions
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => {
    console.log('Backend API Running on http://localhost:3001');
});
