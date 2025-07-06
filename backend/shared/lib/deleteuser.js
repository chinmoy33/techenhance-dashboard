// server/deleteUser.js

//import { createClient } from '@supabase/supabase-js';
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL ,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteUser(userId) {
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error('❌ Failed to delete user:', error.message);
    return { success: false, error: error.message };
  }

  console.log('✅ User deleted');
  return { success: true };
}
deleteUser('d5f52eef-9865-4713-a1ca-564bcf62e706');