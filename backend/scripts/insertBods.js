import mongoose from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
config();

// Sample BOD user data
const bodUsers = [
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    password: "hashedPassword123",
    role: "bod",
    phoneNumber: "123-456-7890",
    joinDate: new Date("2022-01-01"),
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    password: "hashedPassword456",
    role: "bod",
    phoneNumber: "234-567-8901",
    joinDate: new Date("2022-02-15"),
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@example.com",
    password: "hashedPassword789",
    role: "bod",
    phoneNumber: "345-678-9012",
    joinDate: new Date("2022-03-10"),
  },
  {
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "e.rodriguez@example.com",
    password: "hashedPasswordABC",
    role: "bod",
    phoneNumber: "456-789-0123",
    joinDate: new Date("2022-04-20"),
  },
  {
    firstName: "David",
    lastName: "Kim",
    email: "d.kim@example.com",
    password: "hashedPasswordDEF",
    role: "bod",
    phoneNumber: "567-890-1234",
    joinDate: new Date("2022-05-05"),
  },
  {
    firstName: "Lisa",
    lastName: "Wong",
    email: "l.wong@example.com",
    password: "hashedPasswordGHI",
    role: "bod",
    phoneNumber: "678-901-2345",
    joinDate: new Date("2022-06-15"),
  },
];

// Hash passwords and insert users
async function insertUsersWithHashedPasswords() {
  const saltRounds = 10;

  // Hash passwords for all users
  const usersWithHashedPasswords = await Promise.all(
    bodUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, saltRounds),
    }))
  );

  // Connect and insert users
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    await User.insertMany(usersWithHashedPasswords);
    console.log("Successfully inserted 5 BOD users");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the insertion
insertUsersWithHashedPasswords();
