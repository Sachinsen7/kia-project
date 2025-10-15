require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../modules/users/user.model');

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kia-project');
    console.log('MongoDB connected for checking users.');

    // Get count
    const count = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${count}`);

    if (count > 0) {
      // Show all users
      const users = await User.find().select('email firstName lastName country isActive createdAt');
      console.log('\n👥 All users in database:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`      Country: ${user.country}, Active: ${user.isActive}, Created: ${user.createdAt}`);
      });
    } else {
      console.log('\n❌ No users found in database');
    }

    // Check database name
    console.log(`\n🗄️  Database name: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Connection string: ${mongoose.connection.host}:${mongoose.connection.port}`);

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    mongoose.disconnect();
    console.log('\nMongoDB disconnected.');
  }
};

// Run the function
checkUsers();

