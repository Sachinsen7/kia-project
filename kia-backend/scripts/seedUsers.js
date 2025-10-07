// const mongoose = require("mongoose");
// const User = require("../modules/users/user.model");
// require("dotenv").config();

// const users = [
// {
//   email: "sparshsahu8435@gmail.com",
//   title: "Mr.",
//   firstName: "John",
//   lastName: "Doe",
//   region: "Asia",
//   country: "India",
//   nationality: "Indian",
//   isActive: false,
//   password: "",
// },
// {
//   email: "sparshsahu004@gmail.com",
//   title: "Mr.",
//   firstName: "lam",
//   lastName: "Doe",
//   region: "Asia",
//   country: "India",
//   nationality: "Indian",
//   isActive: false,
//   password: "",
// },
// {
//   email: "albusseverus816@gmail.com",
//   title: "Mr.",
//   firstName: "albus",
//   lastName: "Doe",
//   region: "Asia",
//   country: "India",
//   nationality: "Indian",
//   isActive: false,
//   password: "",
// },
// {
//   email: "himankjanjire4@gmail.com",
//   title: "Mr.",
//   firstName: "himank",
//   lastName: "Doe",
//   region: "Asia",
//   country: "India",
//   nationality: "Indian",
//   isActive: false,
//   password: "",
// },
// {
//   email: "himank@learning-crew.com",
//   title: "Mr.",
//   firstName: "himankOO",
//   lastName: "Doe",
//   region: "Asia",
//   country: "India",
//   nationality: "Indian",
//   isActive: false,
//   password: "", // No password yet
// },
// {
//   email: "mkhan7@kia.com",
//   title: "Mr.",
//   firstName: "mkhan",
//   lastName: "Doe",
//   region: "Asia",
//   country: "Abu Dhabi",
//   nationality: "Arab",
//   isActive: false,
//   password: "", // No password yet
// },
//   // ...add more users
// ];

// mongoose.connect(process.env.MONGO_URI).then(async () => {
//   await User.deleteMany({});
//   await User.insertMany(users);
//   console.log("Users seeded!");
//   process.exit();
// });

const mongoose = require("mongoose");
const User = require("../modules/users/user.model");
require("dotenv").config();

const users = [
  {
    email: "sparshsahu8435@gmail.com",
    title: "Mr.",
    firstName: "John",
    lastName: "Doe",
    region: "Asia",
    country: "India",
    nationality: "Indian",
    isActive: false,
    password: "",
  },
  {
    email: "sparshsahu004@gmail.com",
    title: "Mr.",
    firstName: "lam",
    lastName: "Doe",
    region: "Asia",
    country: "India",
    nationality: "Indian",
    isActive: false,
    password: "",
  },
  {
    email: "albusseverus816@gmail.com",
    title: "Mr.",
    firstName: "albus",
    lastName: "Doe",
    region: "Asia",
    country: "India",
    nationality: "Indian",
    isActive: false,
    password: "",
  },
  {
    email: "himankjanjire4@gmail.com",
    title: "Mr.",
    firstName: "himank",
    lastName: "Doe",
    region: "Asia",
    country: "India",
    nationality: "Indian",
    isActive: false,
    password: "",
  },
  {
    email: "himank@learning-crew.com",
    title: "Mr.",
    firstName: "himankOO",
    lastName: "Doe",
    region: "Asia",
    country: "India",
    nationality: "Indian",
    isActive: false,
    password: "", // No password yet
  },
  {
    email: "mkhan7@kia.com",
    title: "Mr.",
    firstName: "mkhan",
    lastName: "Doe",
    region: "Asia",
    country: "Abu Dhabi",
    nationality: "Arab",
    isActive: false,
    password: "12345678", // No password yet
  },
  {
    email: "srajalvishwakarma8@gmail.com",
    title: "Mr.",
    firstName: "mkhan",
    lastName: "Doe",
    region: "Asia",
    country: "Abu Dhabi",
    nationality: "Arab",
    isActive: false,
    password: "", // No password yet
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create(user);
        console.log(`Added new user: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }

    console.log("✨ Seeding completed!");
    process.exit();
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
})();
