import Stripe from "stripe";
import { config } from "dotenv";
import { toSmallestUnit, fromSmallestUnit } from "../utils/currency.utils.js";
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe Payment Service
 * Handles credit card payments for international users
 */

/**
 * Create a payment intent for card payments
 * @param {Object} params - Payment parameters
 * @param {number} params.amount - Amount in main currency unit
 * @param {string} params.currency - ISO currency code
 * @param {string} params.description - Payment description
 * @param {string} params.customerId - Stripe customer ID (optional)
 * @param {Object} params.metadata - Additional metadata
 * @returns {Promise<Object>} Payment intent details
 */
export async function createPaymentIntent({
  amount,
  currency = "USD",
  description,
  customerId,
  metadata = {},
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toSmallestUnit(amount, currency),
      currency: currency.toLowerCase(),
      description,
      customer: customerId,
      metadata: {
        ...metadata,
        service: "NjangiHub",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: currency,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error("Stripe payment intent creation failed:", error.message);
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
}

/**
 * Retrieve payment intent status
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Payment status
 */
export async function getPaymentStatus(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: true,
      status: paymentIntent.status, // requires_payment_method, requires_confirmation, requires_action, processing, requires_capture, canceled, succeeded
      amount: fromSmallestUnit(paymentIntent.amount, paymentIntent.currency.toUpperCase()),
      currency: paymentIntent.currency.toUpperCase(),
      metadata: paymentIntent.metadata,
    };
  } catch (error) {
    console.error("Failed to retrieve payment status:", error.message);
    throw new Error(`Failed to get payment status: ${error.message}`);
  }
}

/**
 * Confirm a payment intent (for server-side confirmation)
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise<Object>} Confirmation result
 */
export async function confirmPayment(paymentIntentId, paymentMethodId) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    return {
      success: true,
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Payment confirmation failed:", error.message);
    throw new Error(`Payment confirmation failed: ${error.message}`);
  }
}

/**
 * Create or retrieve a Stripe customer
 * @param {Object} params - Customer parameters
 * @param {string} params.email - Customer email
 * @param {string} params.name - Customer name
 * @param {string} params.phone - Customer phone
 * @param {Object} params.metadata - Additional metadata
 * @returns {Promise<Object>} Customer details
 */
export async function createCustomer({ email, name, phone, metadata = {} }) {
  try {
    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return {
        success: true,
        customerId: existingCustomers.data[0].id,
        existing: true,
      };
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata: {
        ...metadata,
        service: "NjangiHub",
      },
    });

    return {
      success: true,
      customerId: customer.id,
      existing: false,
    };
  } catch (error) {
    console.error("Failed to create Stripe customer:", error.message);
    throw new Error(`Failed to create customer: ${error.message}`);
  }
}

/**
 * Create a payout (withdrawal) to a connected account or bank
 * Note: Requires Stripe Connect setup for payouts
 * @param {Object} params - Payout parameters
 * @param {number} params.amount - Amount in main currency unit
 * @param {string} params.currency - ISO currency code
 * @param {string} params.destination - Destination account/bank ID
 * @param {string} params.description - Payout description
 * @returns {Promise<Object>} Payout details
 */
export async function createPayout({
  amount,
  currency = "USD",
  destination,
  description,
}) {
  try {
    const payout = await stripe.payouts.create({
      amount: toSmallestUnit(amount, currency),
      currency: currency.toLowerCase(),
      destination,
      description,
      metadata: {
        service: "NjangiHub",
      },
    });

    return {
      success: true,
      payoutId: payout.id,
      amount: amount,
      currency: currency,
      status: payout.status,
    };
  } catch (error) {
    console.error("Stripe payout failed:", error.message);
    throw new Error(`Payout failed: ${error.message}`);
  }
}

/**
 * Refund a payment
 * @param {string} paymentIntentId - Payment intent ID to refund
 * @param {number} amount - Amount to refund (optional, full refund if not specified)
 * @returns {Promise<Object>} Refund details
 */
export async function refundPayment(paymentIntentId, amount = null) {
  try {
    const refundParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      refundParams.amount = toSmallestUnit(amount, paymentIntent.currency.toUpperCase());
    }

    const refund = await stripe.refunds.create(refundParams);

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: fromSmallestUnit(refund.amount, refund.currency.toUpperCase()),
      currency: refund.currency.toUpperCase(),
    };
  } catch (error) {
    console.error("Refund failed:", error.message);
    throw new Error(`Refund failed: ${error.message}`);
  }
}

/**
 * Verify webhook signature
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe signature header
 * @returns {Object} Verified event
 */
export function verifyWebhookSignature(payload, signature) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    throw new Error("Invalid webhook signature");
  }
}

export default {
  createPaymentIntent,
  getPaymentStatus,
  confirmPayment,
  createCustomer,
  createPayout,
  refundPayment,
  verifyWebhookSignature,
};
