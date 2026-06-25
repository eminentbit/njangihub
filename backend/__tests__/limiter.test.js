import request from "supertest";
import express from "express";
import { createLimiter } from "../middleware/limiter";

// Build an isolated app with its own limiter so tests don't share counter state.
const buildApp = (options) => {
  const app = express();
  app.use(express.json());
  app.use("/protected", createLimiter(options), (req, res) => {
    res.status(200).json({ message: "Protected resource accessed!" });
  });
  return app;
};

describe("Rate Limiter Middleware", () => {
  it("should allow requests within the rate limit", async () => {
    const app = buildApp({ max: 5, windowMs: 60 * 1000 });

    for (let i = 0; i < 5; i++) {
      const response = await request(app).get("/protected");
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Protected resource accessed!");
    }
  });

  it("should return 429 Too Many Requests when the limit is exceeded", async () => {
    const app = buildApp({ max: 5, windowMs: 60 * 1000 });

    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      await request(app).get("/protected");
    }

    // The next request is over the limit
    const response = await request(app).get("/protected");
    expect(response.statusCode).toBe(429);
    expect(response.body.message).toBe(
      "Too many requests, please try again later."
    );
  });

  it("should reset the limit after the windowMs period", async () => {
    const app = buildApp({ max: 3, windowMs: 1000 });

    // Exhaust the limit
    for (let i = 0; i < 3; i++) {
      await request(app).get("/protected");
    }
    const blocked = await request(app).get("/protected");
    expect(blocked.statusCode).toBe(429);

    // Wait for the window to roll over
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const response = await request(app).get("/protected");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Protected resource accessed!");
  }, 10000);
});
