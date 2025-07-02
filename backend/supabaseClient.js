const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://prqpioqtpsjqzdmxdnrl.supabase.co';
const supabaseKey = process.env.anon;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;