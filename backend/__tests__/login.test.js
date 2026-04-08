import request from "supertest";
import express from "express";
import bcryptjs from "bcryptjs";

// Import your models and functions
import User from "../models/user.model";
import NjangiDraft from "../models/njangi.draft.model";
import LastLogin from "../models/login.attempt";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import { getIPAddress } from "../utils/getIPAddress";
import { login } from "../controllers/auth.controller";

// Mock the models and functions to control their behavior during tests
jest.mock("../models/user.model");
jest.mock("../models/njangi.draft.model");
jest.mock("../models/login.attempt");
jest.mock("../utils/generateTokenAndSetCookie");
jest.mock("../utils/getIPAddress");
jest.mock("bcryptjs");

// Create a new express app instance for each test
let app;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.post("/auth/login", login);

  // Reset mocks before each test
  User.findOne.mockReset();
  NjangiDraft.findOne.mockReset();
  LastLogin.create.mockReset();
  LastLogin.findOne.mockReset();
  bcryptjs.compare.mockReset();
  generateTokenAndSetCookie.mockReset();
  getIPAddress.mockReturnValue("127.0.0.1");
});

describe("POST /auth/login", () => {
  it("should return 200 and login successfully with valid credentials and active user", async () => {
    const mockUser = {
      id: "user123",
      _id: "user123",
      email: "test@example.com",
      password: await bcryptjs.hash("password123", 10),
      status: "active",
      role: "user",
      firstName: "Test",
      lastName: "User",
    };
    
    // Mock User.findOne().select()
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });
    
    // Mock LastLogin.findOne().sort().lean()
    LastLogin.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    });
    
    bcryptjs.compare.mockResolvedValue(true);
    generateTokenAndSetCookie.mockImplementation(() => {});
    LastLogin.create.mockResolvedValue({});

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login successfully!");
  });

  it("should return 401 with invalid email", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    NjangiDraft.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "invalid@example.com", password: "password123" });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 401 with valid email but invalid password", async () => {
    const mockUser = {
      id: "user123",
      _id: "user123",
      email: "test@example.com",
      password: await bcryptjs.hash("correctpassword", 10),
      status: "active",
      role: "user",
    };
    
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });
    
    LastLogin.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    });
    
    bcryptjs.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 403 if user status is pending and not BOD", async () => {
    const mockUser = {
      id: "user123",
      _id: "user123",
      email: "test@example.com",
      password: await bcryptjs.hash("password123", 10),
      status: "pending",
      role: "user",
      firstName: "Test",
      lastName: "User",
    };
    
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });
    
    LastLogin.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    });
    
    bcryptjs.compare.mockResolvedValue(true);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("pending");
  });

  it("should return 403 if user status is suspended", async () => {
    const mockUser = {
      id: "user123",
      _id: "user123",
      email: "test@example.com",
      password: await bcryptjs.hash("password123", 10),
      status: "suspended",
      role: "user",
      firstName: "Test",
      lastName: "User",
    };
    
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });
    
    LastLogin.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      })
    });
    
    bcryptjs.compare.mockResolvedValue(true);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("suspended");
  });

  it("should return 403 if email found in NjangiDraft with pending status", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    NjangiDraft.findOne.mockResolvedValue({
      accountSetup: { email: "test@example.com", status: "pending" },
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "anypassword" });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("pending");
  });

  it("should return 403 if email found in NjangiDraft with suspended status", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    NjangiDraft.findOne.mockResolvedValue({
      accountSetup: { email: "test@example.com", status: "suspended" },
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "anypassword" });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toContain("suspended");
  });

  it("should return 500 if there is an internal server error", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error"))
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});
