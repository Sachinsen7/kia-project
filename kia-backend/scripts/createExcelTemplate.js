require('dotenv').config();
const XLSX = require('xlsx');
const path = require('path');

const createExcelTemplate = () => {
  try {
    // Sample data with the fields you mentioned
    const sampleData = [
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        country: 'India',
        RHa: 'Asia Pacific' // This field maps to region
      },
      {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        country: 'Korea',
        RHa: 'Asia Pacific'
      },
      {
        email: 'mike.wilson@example.com',
        firstName: 'Mike',
        lastName: 'Wilson',
        country: 'Japan',
        RHa: 'Asia Pacific'
      }
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Save the file
    const filePath = path.join(__dirname, 'user_import_template.xlsx');
    XLSX.writeFile(workbook, filePath);
    
    console.log('✅ Excel template created successfully!');
    console.log(`📁 File saved at: ${filePath}`);
    console.log('\n📋 Template includes these columns:');
    console.log('   - email (required)');
    console.log('   - firstName (required)');
    console.log('   - lastName (required)');
    console.log('   - country (required)');
    console.log('   - RHa (maps to region field)');
    console.log('\n💡 You can add more rows with your actual data and use this file for import.');

  } catch (error) {
    console.error('❌ Error creating Excel template:', error);
  }
};

// Run the function
createExcelTemplate();
