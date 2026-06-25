/**
 * Payment Gateway Factory
 * Provides unified interface for different payment providers
 */

import * as stripeService from "./stripe.service.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

/**
 * Base Payment Gateway Interface
 * All payment gateways should implement these methods
 */
class PaymentGateway {
  /**
   * Initiate a payment
   * @param {Object} params - Payment parameters
   * @returns {Promise<Object>} Payment initialization result
   */
  async initiatePayment(_params) {
    throw new Error("initiatePayment() must be implemented");
  }

  /**
   * Check payment status
   * @param {string} reference - Payment reference
   * @returns {Promise<Object>} Payment status
   */
  async checkStatus(_reference) {
    throw new Error("checkStatus() must be implemented");
  }

  /**
   * Process withdrawal/payout
   * @param {Object} params - Withdrawal parameters
   * @returns {Promise<Object>} Withdrawal result
   */
  async withdraw(_params) {
    throw new Error("withdraw() must be implemented");
  }
}

/**
 * Campay Gateway - Mobile Money for Cameroon
 */
class CampayGateway extends PaymentGateway {
  constructor(config) {
    super();
    this.baseUrl = config.baseUrl || process.env.CAMPAY_BASE_URL;
    this.token = null;
  }

  async getToken() {
    if (this.token) return this.token;

    const url = `${this.baseUrl}/api/token/`;
    const data = {
      username: process.env.CAMPAY_APP_USERNAME,
      password: process.env.CAMPAY_APP_PASSWORD,
    };

    try {
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      this.token = response.data.token;

      // Refresh token after 50 minutes (expires after 1 hour)
      setTimeout(
        () => {
          this.token = null;
        },
        50 * 60 * 1000,
      );

      return this.token;
    } catch (error) {
      console.error(
        "Campay token error:",
        error?.response?.data || error.message,
      );
      throw new Error("Failed to get Campay authentication token");
    }
  }

  async initiatePayment({
    amount,
    phone,
    description,
    currency = "XAF",
    reference,
    userName,
  }) {
    try {
      const token = await this.getToken();
      const externalRef = reference || `NJANGI-${uuidv4()}`;

      const paymentData = {
        amount,
        from: phone,
        description,
        currency,
        external_reference: externalRef,
        external_user: userName,
      };

      const response = await axios.post(
        `${this.baseUrl}/api/collect/`,
        paymentData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: true,
        provider: "campay",
        reference: externalRef,
        campayReference: response.data.reference,
        status: "pending",
        message: "Payment initiated successfully",
        ...response.data,
      };
    } catch (error) {
      console.error("Campay payment initiation failed:", error?.response?.data);
      return {
        success: false,
        provider: "campay",
        message: error?.response?.data?.message || "Payment initiation failed",
        error: error.message,
      };
    }
  }

  async checkStatus(reference) {
    try {
      const token = await this.getToken();
      const url = `${this.baseUrl}/api/transaction/${reference}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const status = response.data.status?.toLowerCase();
      const isSuccess = status && status.includes("success");

      return {
        success: true,
        provider: "campay",
        reference: reference,
        status: isSuccess ? "completed" : "pending",
        rawStatus: response.data.status,
        data: response.data,
      };
    } catch (error) {
      console.error("Campay status check failed:", error?.response?.data);
      return {
        success: false,
        provider: "campay",
        message: "Failed to check payment status",
        error: error.message,
      };
    }
  }

  async withdraw({ amount, phone, description }) {
    try {
      const token = await this.getToken();
      const reference = `WITHDRAW-${uuidv4()}`;

      const response = await axios.post(
        `${this.baseUrl}/api/withdraw/`,
        {
          amount,
          to: phone,
          description,
          external_reference: reference,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: true,
        provider: "campay",
        reference: reference,
        message: "Withdrawal initiated successfully",
        ...response.data,
      };
    } catch (error) {
      console.error("Campay withdrawal failed:", error?.response?.data);
      return {
        success: false,
        provider: "campay",
        message: "Withdrawal failed",
        error: error.message,
      };
    }
  }
}

/**
 * Stripe Gateway - Credit/Debit Cards for International
 */
class StripeGateway extends PaymentGateway {
  async initiatePayment({
    amount,
    currency = "USD",
    description,
    customerId,
    metadata = {},
  }) {
    try {
      const result = await stripeService.createPaymentIntent({
        amount,
        currency,
        description,
        customerId,
        metadata,
      });

      return {
        success: true,
        provider: "stripe",
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret,
        amount: result.amount,
        currency: result.currency,
        status: result.status,
        message: "Payment intent created successfully",
      };
    } catch (error) {
      console.error("Stripe payment initiation failed:", error.message);
      return {
        success: false,
        provider: "stripe",
        message: "Payment initiation failed",
        error: error.message,
      };
    }
  }

  async checkStatus(paymentIntentId) {
    try {
      const result = await stripeService.getPaymentStatus(paymentIntentId);

      return {
        success: true,
        provider: "stripe",
        paymentIntentId: paymentIntentId,
        status: result.status === "succeeded" ? "completed" : "pending",
        rawStatus: result.status,
        amount: result.amount,
        currency: result.currency,
        metadata: result.metadata,
      };
    } catch (error) {
      console.error("Stripe status check failed:", error.message);
      return {
        success: false,
        provider: "stripe",
        message: "Failed to check payment status",
        error: error.message,
      };
    }
  }

  async withdraw({ amount, currency = "USD", destination, description }) {
    try {
      const result = await stripeService.createPayout({
        amount,
        currency,
        destination,
        description,
      });

      return {
        success: true,
        provider: "stripe",
        payoutId: result.payoutId,
        amount: result.amount,
        currency: result.currency,
        status: result.status,
        message: "Payout initiated successfully",
      };
    } catch (error) {
      console.error("Stripe payout failed:", error.message);
      return {
        success: false,
        provider: "stripe",
        message: "Payout failed",
        error: error.message,
      };
    }
  }

  async createCustomer({ email, name, phone, metadata }) {
    return await stripeService.createCustomer({ email, name, phone, metadata });
  }
}

/**
 * Payment Gateway Factory
 * Returns the appropriate payment gateway based on provider
 */
export function getPaymentGateway(provider) {
  switch (provider?.toLowerCase()) {
    case "campay":
      return new CampayGateway({});
    case "stripe":
      return new StripeGateway();
    case "mpesa":
    case "mtn":
    case "paystack":
      // TODO: Implement other gateways as needed
      throw new Error(`Payment provider ${provider} not yet implemented`);
    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}

/**
 * Get payment gateway based on user location
 * @param {Object} location - User location from geolocation service
 * @returns {PaymentGateway} Payment gateway instance
 */
export function getGatewayForLocation(location) {
  const provider = location?.provider || location?.paymentProvider || "stripe";
  return getPaymentGateway(provider);
}

export { CampayGateway, StripeGateway };
