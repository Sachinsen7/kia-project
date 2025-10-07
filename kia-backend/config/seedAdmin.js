const Admin = require("../modules/admin/admin.model");
const bcrypt = require("bcrypt");
const userModel = require("../modules/users/user.model");

const seedAdmin = async () => {
  try {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log("👨‍💻 Admin already exists:", existingAdmin.username);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({ username, password: hashedPassword });
    console.log("🎉 Default admin created:", username);
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
};

const seedUser = async () => {
  try {
    const email = process.env.ADMIN_USERNAME || "mkhan7@kia.com";
    const password = process.env.ADMIN_PASSWORD || "12345678";
    const title = "Mr.";
    const firstName = "m";
    const lastName = "khan";
    const region = "Arab";
    const country = "Abu dhabi";
    const nationality = "Arab";

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("👨‍💻 User already exists:", existingUser.email);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      email,
      password: hashedPassword,
      title,
      firstName,
      lastName,
      region,
      country,
      nationality,
    });
    console.log("🎉 Default user created:", email);
  } catch (err) {
    console.error("❌ Error seeding user:", err.message);
  }
};

module.exports = seedAdmin;
module.exports = seedUser;
