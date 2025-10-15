require('dotenv').config();
const fs = require('fs');
const path = require('path');

const createCSVTemplate = () => {
  try {
    // Sample data with the fields you mentioned
    const csvContent = `email,firstName,lastName,country,RHa
john.doe@example.com,John,Doe,India,Asia Pacific
jane.smith@example.com,Jane,Smith,Korea,Asia Pacific
mike.wilson@example.com,Mike,Wilson,Japan,Asia Pacific`;

    // Save the file
    const filePath = path.join(__dirname, 'user_import_template.csv');
    fs.writeFileSync(filePath, csvContent);
    
    console.log('✅ CSV template created successfully!');
    console.log(`📁 File saved at: ${filePath}`);
    console.log('\n📋 Template includes these columns:');
    console.log('   - email (required)');
    console.log('   - firstName (required)');
    console.log('   - lastName (required)');
    console.log('   - country (required)');
    console.log('   - RHa (maps to region field)');
    console.log('\n💡 You can add more rows with your actual data and use this file for import.');

  } catch (error) {
    console.error('❌ Error creating CSV template:', error);
  }
};

// Run the function
createCSVTemplate();
