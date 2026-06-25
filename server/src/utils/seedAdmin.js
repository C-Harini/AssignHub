const User = require('../models/User');

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@assignhub.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Administrator';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seed] Admin already exists: ${email}`);
    return;
  }
  await User.create({
    name,
    email,
    password,
    role: 'admin',
    status: 'approved',
    rollNumber: '',
  });
  console.log(`[seed] Default admin created: ${email}`);
}

module.exports = seedAdmin;
