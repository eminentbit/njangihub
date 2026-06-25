import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const createUser = async (
  accountData,
  res
  // role = "member",
  // status = "pending"
) => {
  console.log(`Creating user with data: ${JSON.stringify(accountData)}`);
  const existing = await User.findOne({ email: accountData.email });
  if (existing) {
    return res
      .status(400)
      .json({
        success: false,
        message: "User already exists. Please try again!",
      });
  }

  // const passwordHash = await bcryptjs.hash(accountData.password, 12);

  //verification code
  const generateOTP = Math.floor(100000 + Math.random() * 900000).toString();

  const user = new User({
    firstName: accountData.firstName,
    lastName: accountData.lastName,
    email: accountData.email,
    phoneNumber: accountData.phoneNumber,
    password: accountData.password,
    role: accountData.role || "member",
    status: accountData.status || "pending",
    profilePicUrl: accountData.profilePicUrl || "",
    isVerified: false,
    verificationToken: generateOTP,
    verificationTokenExpireAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    lastlogin: new Date(),
  });

  const savedUser = await user.save();

  generateTokenAndSetCookie(res, savedUser._id);

  console.log(`Generated token and set cookie for user: ${savedUser._id}`);
  console.log(`User created: ${JSON.stringify(savedUser)}`);

  //send verification email
  //  await sendVerificationEmail(newUser.email, verificationToken);

  return savedUser;
};
