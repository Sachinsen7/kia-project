require('dotenv').config();
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const User = require('../modules/users/user.model');

const importUsersFromExcel = async (excelFilePath) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kia-project');
    console.log('MongoDB connected for importing users.');

    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(excelFilePath)) {
      console.error(`❌ Excel file not found: ${excelFilePath}`);
      return;
    }

    // Read Excel file
    console.log(`📖 Reading Excel file: ${excelFilePath}`);
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(`📊 Found ${jsonData.length} rows in Excel file`);

    if (jsonData.length === 0) {
      console.log('❌ No data found in Excel file');
      return;
    }

    // Show sample data structure
    console.log('\n📋 Sample data structure:');
    console.log('Available columns:', Object.keys(jsonData[0]));
    console.log('\nFirst row sample:');
    console.log(jsonData[0]);

    // Process each row
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    console.log('\n🔄 Processing users...\n');

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      try {
        // Extract required fields (case-insensitive)
        const email = row.email || row.Email || row.EMAIL || '';
        const firstName = row.firstName || row.FirstName || row['First Name'] || row['FIRST NAME'] || '';
        const lastName = row.lastName || row.LastName || row['Last Name'] || row['LAST NAME'] || '';
        const country = row.country || row.Country || row.COUNTRY || '';
        const region = row.RHa || row.rha || row.RHA || row.region || row.Region || row.REGION || '';

        // Validate required fields
        if (!email || !firstName || !lastName || !country) {
          const missingFields = [];
          if (!email) missingFields.push('email');
          if (!firstName) missingFields.push('firstName');
          if (!lastName) missingFields.push('lastName');
          if (!country) missingFields.push('country');
          
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          console.log(`⚠️  Row ${i + 1}: User with email ${email} already exists, skipping...`);
          continue;
        }

        // Create user object with all required fields
        const userData = {
          email: email.toLowerCase().trim(),
          password: '', // Empty string as requested
          title: '', // Empty string as requested
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          region: region.trim(), // Map RHa field to region
          country: country.trim(),
          nationality: '', // Empty string as requested
          isActive: false // Default to false
        };

        // Create user
        const user = new User(userData);
        await user.save();
        
        console.log(`✅ Row ${i + 1}: Created user ${firstName} ${lastName} (${email})`);
        successCount++;

      } catch (error) {
        console.log(`❌ Row ${i + 1}: Error - ${error.message}`);
        errors.push({
          row: i + 1,
          data: row,
          error: error.message
        });
        errorCount++;
      }
    }

    // Summary
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📋 Total processed: ${jsonData.length} rows`);

    if (errors.length > 0) {
      console.log('\n❌ Error Details:');
      errors.forEach(err => {
        console.log(`   Row ${err.row}: ${err.error}`);
      });
    }

    // Show final count
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);

  } catch (error) {
    console.error('❌ Error importing users:', error);
  } finally {
    mongoose.disconnect();
    console.log('\nMongoDB disconnected.');
  }
};

// Get Excel file path from command line argument
const excelFilePath = process.argv[2];

if (!excelFilePath) {
  console.log('❌ Please provide the Excel file path as an argument');
  console.log('Usage: node scripts/importUsersFromExcel.js <path-to-excel-file>');
  console.log('Example: node scripts/importUsersFromExcel.js ../data/users.xlsx');
  process.exit(1);
}

// Run the import
importUsersFromExcel(excelFilePath);
