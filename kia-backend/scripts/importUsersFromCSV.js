require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const User = require('../modules/users/user.model');

const importUsersFromCSV = async (csvFilePath) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kia-project');
    console.log('MongoDB connected for importing users.');

    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`❌ CSV file not found: ${csvFilePath}`);
      return;
    }

    console.log(`📖 Reading CSV file: ${csvFilePath}`);
    
    const results = [];
    
    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`📊 Found ${results.length} rows in CSV file`);

    if (results.length === 0) {
      console.log('❌ No data found in CSV file');
      return;
    }

    // Show sample data structure
    console.log('\n📋 Sample data structure:');
    console.log('Available columns:', Object.keys(results[0]));
    console.log('\nFirst row sample:');
    console.log(results[0]);

    // Process each row
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    console.log('\n🔄 Processing users...\n');

    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      
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
    console.log(`📋 Total processed: ${results.length} rows`);

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

// Get CSV file path from command line argument
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.log('❌ Please provide the CSV file path as an argument');
  console.log('Usage: node scripts/importUsersFromCSV.js <path-to-csv-file>');
  console.log('Example: node scripts/importUsersFromCSV.js ../data/users.csv');
  process.exit(1);
}

// Run the import
importUsersFromCSV(csvFilePath);
