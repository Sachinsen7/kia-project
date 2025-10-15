const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test the seed users API endpoint
const testSeedUsersAPI = async () => {
  try {
    console.log('🧪 Testing Seed Users API...\n');

    // Create a test CSV file
    const testData = `email,firstName,lastName,country,RHa
test1@example.com,Test,User1,India,Ignored
test2@example.com,Test,User2,Korea,Ignored
test3@example.com,Test,User3,Japan,Ignored`;

    const testFilePath = path.join(__dirname, 'test_users.csv');
    fs.writeFileSync(testFilePath, testData);
    console.log('✅ Created test CSV file');

    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));

    // Make API request
    const response = await fetch('https://kia-project-hlrv.onrender.com/api/admin/seed-users', {
      method: 'POST',
      body: form,
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE', // Replace with actual admin token
        ...form.getHeaders()
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ API Error:', JSON.stringify(result, null, 2));
    }

    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log('🧹 Cleaned up test file');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Instructions for manual testing
console.log('📋 Manual Testing Instructions:');
console.log('1. Login as admin to get your token');
console.log('2. Use Postman or curl to test the API:');
console.log('');
console.log('POST https://kia-project-hlrv.onrender.com/api/admin/seed-users');
console.log('Headers:');
console.log('  Authorization: Bearer YOUR_ADMIN_TOKEN');
console.log('Body:');
console.log('  form-data with field "file" containing your Excel/CSV file');
console.log('');
console.log('Example curl command:');
console.log('curl -X POST \\');
console.log('  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\');
console.log('  -F "file=@path/to/your/file.xlsx" \\');
console.log('  https://kia-project-hlrv.onrender.com/api/admin/seed-users');
console.log('');

// Uncomment the line below to run the test (requires admin token)
// testSeedUsersAPI();
