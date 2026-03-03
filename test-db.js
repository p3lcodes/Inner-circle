import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const VITE_SUPABASE_URL = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function checkDatabase() {
    console.log("1. Testing Admin Login (P3L Trader)...");
    const { data: adminLogin, error: adminErr } = await supabase.auth.signInWithPassword({
        email: 'trader@p3l.com',
        password: 'Guyesa_10333'
    });

    if (adminErr) {
        console.error("❌ Admin Login Failed:", adminErr.message);
    } else {
        console.log("✅ Admin Login Success!", adminLogin.user.email);
    }

    console.log("\n2. Testing Investor Login (newuser999123@gmail.com)...");
    const { data: investorLogin, error: invErr } = await supabase.auth.signInWithPassword({
        email: 'newuser999123@gmail.com',
        password: 'Password123!'
    });

    if (invErr) {
        console.error("❌ Investor Login Failed:", invErr.message);
    } else {
        console.log("✅ Investor Login Success!", investorLogin.user.email);
    }

    console.log("\n3. Checking Public Users Table Integration (Trigger Check)...");
    const { data: users, error: usersErr } = await supabase.from('users').select('*');
    if (usersErr) {
        console.error("❌ Failed to read 'users' table:", usersErr.message);
    } else {
        console.log("✅ Users Found in Database:");
        console.table(users);
    }
}

checkDatabase();
