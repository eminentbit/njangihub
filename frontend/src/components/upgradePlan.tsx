import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import pricingTiers from "../utils/pricing";
import PricingTier from "./PricingTier";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title */}
              <h2 className="text-3xl font-bold text-red-600 mb-2">
                Limit Reached
              </h2>
              <p className="text-gray-600 mb-6">
                You’ve hit the maximum limit of your current plan. Choose a plan
                below to upgrade and continue enjoying our services.
              </p>

              {/* Pricing Tiers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pricingTiers.map((plan) => (
                  <PricingTier
                    key={plan.title}
                    price={plan.price}
                    title={plan.title}
                    description={plan.description}
                    features={plan.features}
                    recommended={plan.recommended}
                    ctaText={plan.ctaText}
                  />
                ))}
              </div>

              {/* Upgrade Button */}
              <button
                type="button"
                className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
                onClick={() => alert("Redirect to upgrade")}
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
