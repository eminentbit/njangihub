import { Router } from "express";
import express from "express";
import verifyToken from "../middleware/verify.token.js";
import { locationDetectionMiddleware } from "../services/geolocation.service.js";
import {
  initiatePayment,
  checkPaymentStatus,
  createStripePaymentIntent,
  confirmStripePayment,
} from "../controllers/payment.unified.controller.js";
import handleStripeWebhook from "../controllers/stripe.webhook.controller.js";

const router = Router();

// Apply location detection to all payment routes (except webhooks)
router.use((req, res, next) => {
  // Skip location detection for webhook route
  if (req.path.includes('/webhook')) {
    return next();
  }
  return locationDetectionMiddleware(req, res, next);
});

/**
 * Unified payment initiation endpoint
 * Automatically selects payment gateway based on user location
 * Supports both Campay (mobile money) and Stripe (credit card)
 */
router.post("/initiate", verifyToken, initiatePayment);

/**
 * Check payment status (works for both Campay and Stripe)
 * Uses payment provider from transaction record
 */
router.get("/status/:reference", verifyToken, checkPaymentStatus);

/**
 * Stripe-specific endpoints
 */

// Create Stripe payment intent for card payments
router.post("/stripe/create-intent", verifyToken, createStripePaymentIntent);

// Confirm Stripe payment (server-side confirmation if needed)
router.post("/stripe/confirm", verifyToken, confirmStripePayment);

// Stripe webhooks (raw body required for signature verification)
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
