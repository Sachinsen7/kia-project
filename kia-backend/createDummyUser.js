const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./modules/users/user.model");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/kia-project");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const createDummyUser = async () => {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: "hsjang@learning-crew.com" });
    
    if (existingUser) {
      console.log("User already exists with email: hsjang@learning-crew.com");
      return;
    }

    // Hash the password
    const salt = 10;
    const hashedPassword = await bcrypt.hash("hyosnag123", salt);

    // Create the dummy user
    const dummyUser = await User.create({
      email: "hsjang@learning-crew.com",
      password: hashedPassword,
      title: "Mr",
      firstName: "Hyosang",
      lastName: "Jang",
      region: "Asia", // Assuming Korea is in Asia region
      country: "Korea",
      nationality: "Korean",
      isActive: true
    });

    console.log("Dummy user created successfully:");
    console.log({
      email: dummyUser.email,
      title: dummyUser.title,
      firstName: dummyUser.firstName,
      lastName: dummyUser.lastName,
      region: dummyUser.region,
      country: dummyUser.country,
      nationality: dummyUser.nationality,
      isActive: dummyUser.isActive
    });

  } catch (error) {
    console.error("Error creating dummy user:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the script
createDummyUser();
