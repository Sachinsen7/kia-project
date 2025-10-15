require('dotenv').config();
const mongoose = require('mongoose');
const Qna = require('../modules/qna/qna.model');

const checkQnas = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kia-project');
    console.log('MongoDB connected for checking QNAs.');

    // Get count
    const count = await Qna.countDocuments();
    console.log(`\n📊 Total QNAs in database: ${count}`);

    if (count > 0) {
      // Show all QNAs
      const qnas = await Qna.find().populate('createdBy', 'firstName lastName email').select('title description type createdByName country createdAt');
      console.log('\n❓ All QNAs in database:');
      qnas.forEach((qna, index) => {
        console.log(`   ${index + 1}. ${qna.title}`);
        console.log(`      Description: ${qna.description.substring(0, 50)}...`);
        console.log(`      Type: ${qna.type}, Country: ${qna.country}`);
        console.log(`      Created: ${qna.createdAt}`);
        console.log('');
      });
    } else {
      console.log('\n❌ No QNAs found in database');
    }

    // Check database name
    console.log(`\n🗄️  Database name: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Connection string: ${mongoose.connection.host}:${mongoose.connection.port}`);

  } catch (error) {
    console.error('❌ Error checking QNAs:', error);
  } finally {
    mongoose.disconnect();
    console.log('\nMongoDB disconnected.');
  }
};

// Run the function
checkQnas();

