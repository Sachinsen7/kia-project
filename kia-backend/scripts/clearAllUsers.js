require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../modules/users/user.model');

const clearAllUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kia-project');
    console.log('MongoDB connected for clearing users.');

    // Get count before deletion
    const countBefore = await User.countDocuments();
    console.log(`Found ${countBefore} users in database`);

    if (countBefore === 0) {
      console.log('No users found to delete.');
      return;
    }

    // Show some user details before deletion
    const sampleUsers = await User.find().limit(3).select('email firstName lastName');
    console.log('\n📋 Sample users to be deleted:');
    sampleUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
    });
    if (countBefore > 3) {
      console.log(`   ... and ${countBefore - 3} more users`);
    }

    // Confirm deletion
    console.log(`\n⚠️  WARNING: This will delete ALL ${countBefore} users from the database!`);
    console.log('This action cannot be undone.\n');

    // Delete all users
    const result = await User.deleteMany({});
    
    console.log(`✅ Successfully cleared ${result.deletedCount} users from database`);
    console.log(`📊 Deleted: ${result.deletedCount} users`);
    console.log(`📊 Remaining: ${await User.countDocuments()} users`);

  } catch (error) {
    console.error('❌ Error clearing users:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

// Run the function
clearAllUsers();
