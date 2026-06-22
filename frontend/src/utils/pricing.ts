const pricingTiers = [
  {
    title: "Starter",
    price: 5000,
    description: "Perfect for small community groups",
    features: [
      "Up to 15 members per group",
      "5 active Njangi groups",
      "Basic reporting",
      "Email notifications",
      "Standard security",
    ],
    recommended: false,
    ctaText: "Get Started",
  },
  {
    title: "Pro",
    price: 15000,
    description: "For growing communities with multiple groups",
    features: [
      "Up to 50 members per group",
      "15 active Njangi groups",
      "Advanced reporting & analytics",
      "Email & SMS notifications",
      "Enhanced security",
      "Payment reminders",
      "Group chat",
    ],
    recommended: true,
    ctaText: "Get Started",
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "For large organizations and institutions",
    features: [
      "Unlimited members",
      "Unlimited Njangi groups",
      "Custom reporting",
      "Priority support",
      "Advanced security",
      "API access",
      "Custom integration",
      "Dedicated account manager",
    ],
    recommended: false,
    ctaText: "Contact Sales",
  },
];

export default pricingTiers;
