const XLSX = require('xlsx');
const fs = require('fs');
const csv = require('csv-parser');
const User = require('../users/user.model');

// Helper function to process Excel/CSV data
const processFileData = async (filePath, fileType) => {
  try {
    let jsonData = [];

    if (fileType === 'excel') {
      // Process Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet);
    } else if (fileType === 'csv') {
      // Process CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => jsonData.push(data))
          .on('end', resolve)
          .on('error', reject);
      });
    }

    return jsonData;
  } catch (error) {
    throw new Error(`Error processing file: ${error.message}`);
  }
};

// Helper function to import users from processed data
const importUsersFromData = async (jsonData) => {
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

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
        errors.push({
          row: i + 1,
          data: row,
          error: `User with email ${email} already exists`
        });
        errorCount++;
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
      
      successCount++;

    } catch (error) {
      errors.push({
        row: i + 1,
        data: row,
        error: error.message
      });
      errorCount++;
    }
  }

  return { successCount, errorCount, errors };
};

// Main controller function
exports.seedUsersFromFile = async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Only admin can seed users from file" 
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload an Excel (.xlsx) or CSV (.csv) file."
      });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname.toLowerCase();
    
    // Determine file type
    let fileType;
    if (originalName.endsWith('.xlsx') || originalName.endsWith('.xls')) {
      fileType = 'excel';
    } else if (originalName.endsWith('.csv')) {
      fileType = 'csv';
    } else {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Please upload Excel (.xlsx) or CSV (.csv) file."
      });
    }

    console.log(`📁 Admin ${req.user.email} uploaded file: ${originalName}`);

    // Process the file
    const jsonData = await processFileData(filePath, fileType);
    
    if (jsonData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "No data found in the uploaded file."
      });
    }

    console.log(`📊 Found ${jsonData.length} rows in uploaded file`);

    // Import users
    const { successCount, errorCount, errors } = await importUsersFromData(jsonData);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Get final count
    const totalUsers = await User.countDocuments();

    // Prepare response
    const response = {
      success: true,
      message: "File processing completed",
      summary: {
        totalRows: jsonData.length,
        successfullyImported: successCount,
        errors: errorCount,
        totalUsersInDatabase: totalUsers
      }
    };

    // Include errors if any
    if (errors.length > 0) {
      response.errors = errors.slice(0, 10); // Limit to first 10 errors
      if (errors.length > 10) {
        response.moreErrors = errors.length - 10;
      }
    }

    console.log(`✅ Admin ${req.user.email} completed seeding: ${successCount} users imported, ${errorCount} errors`);
    
    res.json(response);

  } catch (error) {
    console.error("❌ Error in seedUsersFromFile:", error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
