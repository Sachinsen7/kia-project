require('dotenv').config();
const mongoose = require('mongoose');
const Qna = require('../modules/qna/qna.model');

const createTestQnas = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kia-project');
    console.log('MongoDB connected for creating test QNAs.');

    // Create some test QNAs
    const testQnas = [
      {
        title: "Test QNA 1",
        description: "This is a test question about Kia's future plans",
        type: "ask_kia",
        createdByName: "Test User 1",
        country: "India"
      },
      {
        title: "Test QNA 2", 
        description: "This is another test question about GOEF event",
        type: "goef_event",
        createdByName: "Test User 2",
        country: "Korea"
      },
      {
        title: "Test QNA 3",
        description: "This is a third test question about sustainability",
        type: "ask_kia", 
        createdByName: "Test User 3",
        country: "Japan"
      }
    ];

    const result = await Qna.insertMany(testQnas);
    console.log(`✅ Successfully created ${result.length} test QNAs`);
    
    // Show what was created
    result.forEach((qna, index) => {
      console.log(`   ${index + 1}. ${qna.title} (${qna.type})`);
    });

  } catch (error) {
    console.error('❌ Error creating test QNAs:', error);
  } finally {
    mongoose.disconnect();
    console.log('\nMongoDB disconnected.');
  }
};

// Run the function
createTestQnas();

