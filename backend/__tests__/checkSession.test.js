import request from "supertest";
import express from "express";
import { checkSession } from "../controllers/auth.controller";
import User from "../models/user.model";

jest.mock("../models/user.model");

// Build an app where the authenticated user is injected directly, simulating
// what verifyToken would set as req.user in production.
const buildApp = (user) => {
  const app = express();
  app.use(express.json());
  app.get("/session", (req, res) => {
    req.user = user;
    checkSession(req, res);
  });
  return app;
};

describe("checkSession Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if req.user is not defined", async () => {
    const response = await request(buildApp(undefined)).get("/session");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized: No session found");
  });

  it("should return 401 if req.user.id is not defined", async () => {
    const response = await request(buildApp({})).get("/session");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized: No session found");
  });

  it("should return 401 if user is not found", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const response = await request(buildApp({ id: "user123" })).get("/session");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized: User not found");
    expect(User.findById).toHaveBeenCalledWith("user123");
  });

  it("should return 200 and the user data if found", async () => {
    const mockUser = { id: "user123", email: "test@example.com" };
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const response = await request(buildApp({ id: "user123" })).get("/session");
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith("user123");
  });

  it("should return 500 if there is an internal server error", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    const response = await request(buildApp({ id: "user123" })).get("/session");
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Internal server error");
    expect(User.findById).toHaveBeenCalledWith("user123");
  });
});
