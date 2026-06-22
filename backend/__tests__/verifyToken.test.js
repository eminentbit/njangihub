import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verify.token";
import { config } from "dotenv";
config();

// Mock jwt.verify and process.env for isolated tests
jest.mock("jsonwebtoken");

describe("verifyToken Middleware", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());

    // Define a test route protected by verifyToken
    app.get("/protected", verifyToken, (req, res) => {
      res
        .status(200)
        .json({ message: "Protected route accessed!", user: req.user });
    });
  });

  beforeEach(() => {
    // Reset the mock before each test
    jwt.verify.mockReset();
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/protected");
    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unauthorised! No token provided!");
  });

  it("should return 401 if an invalid token is provided", async () => {
    jwt.verify.mockReturnValue(undefined); // Simulate invalid token

    const response = await request(app)
      .get("/protected")
      .set("Cookie", "token=invalidtoken"); // Set the cookie

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unauthorised! Invalid token provided!");
    expect(jwt.verify).toHaveBeenCalledWith(
      "invalidtoken",
      process.env.JWT_SECRET
    );
  });

  it("should call next() and populate req.user if a valid token is provided", async () => {
    const mockDecodedToken = { userId: "user123" };
    jwt.verify.mockReturnValue(mockDecodedToken);

    const response = await request(app)
      .get("/protected")
      .set("Cookie", "token=validtoken");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Protected route accessed!");
    expect(response.body.user).toEqual({ id: "user123" });
    expect(jwt.verify).toHaveBeenCalledWith(
      "validtoken",
      process.env.JWT_SECRET
    );
  });

  it("should return 401 if jwt.verify throws an error", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt error");
    });

    const response = await request(app)
      .get("/protected")
      .set("Cookie", "token=invalidtoken");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
      "Internal server error! Please try again later!"
    );
    expect(jwt.verify).toHaveBeenCalledWith(
      "invalidtoken",
      process.env.JWT_SECRET
    );
  });
});
