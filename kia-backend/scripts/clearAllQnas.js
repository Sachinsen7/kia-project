require('dotenv').config();
const mongoose = require('mongoose');
const Qna = require('../modules/qna/qna.model');

const clearAllQnas = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kia-project');
    console.log('MongoDB connected for clearing QNAs.');

    // Get count before deletion
    const countBefore = await Qna.countDocuments();
    console.log(`Found ${countBefore} QNAs in database`);


    // Confirm deletion
    console.log(`\n⚠️  WARNING: This will delete ALL ${countBefore} QNAs from the database!`);
    console.log('This action cannot be undone.\n');

    // Delete all QNAs
    const result = await Qna.deleteMany({});
    
    console.log(`✅ Successfully cleared ${result.deletedCount} QNAs from database`);
    console.log(`📊 Deleted: ${result.deletedCount} QNAs`);
    console.log(`📊 Remaining: ${await Qna.countDocuments()} QNAs`);

  } catch (error) {
    console.error('❌ Error clearing QNAs:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

// Run the function
clearAllQnas();
