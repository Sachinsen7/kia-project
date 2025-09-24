
const Admin = require("../modules/admin/admin.model"); 
const bcrypt = require("bcrypt");

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

module.exports = seedAdmin;
