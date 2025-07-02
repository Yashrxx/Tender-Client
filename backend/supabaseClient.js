const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://prqpioqtpsjqzdmxdnrl.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = supabase;
