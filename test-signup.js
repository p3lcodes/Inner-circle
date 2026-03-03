import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const VITE_SUPABASE_URL = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function testRegister() {
    console.log("Testing Signup...");
    const { data, error } = await supabase.auth.signUp({
        email: 'newuser999123@gmail.com',
        password: 'Password123!',
        options: {
            data: {
                full_name: "Test User 2",
                role: "investor"
            }
        }
    });

    if (error) {
        console.error("❌ Signup Failed:", error.message);
    } else {
        console.log("✅ Signup Success!", data.user?.email);
    }
}

testRegister();
