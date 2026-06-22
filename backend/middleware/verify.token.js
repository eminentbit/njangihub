import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token)
    return res.status(401).json({
      success: false,
      message: `Unauthorised! No token provided!`,
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: `Unauthorised! Invalid token provided!`,
      });
    }

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error(`Error verifying token: ${error}`);
    res.status(401).json({
      sucess: false,
      message: `Internal server error! Please try again later!`,
    });
  }
};

export default verifyToken;
