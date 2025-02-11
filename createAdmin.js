const bcrypt = require('bcrypt');
const User = require('./models/User');

const createAdmin = async () => {
  const userCount = await User.countDocuments();
  if (userCount < 1) {
    const hashedPassword = await bcrypt.hash('Yahia1902', 10);
    const adminUser = new User({
      userName: 'Yahia',
      email: 'yahiadjouadi7@gmail.com',
      password: hashedPassword,
      type: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  }
};

module.exports = createAdmin;