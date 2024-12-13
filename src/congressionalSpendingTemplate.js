// congressionalSpendingTemplate.js

import Decimal from "decimal.js";

Decimal.set({ precision: 50 });

// Helper function to create item objects easily
function createItem(name, initialBudget, unitCost, quantity) {
  return {
    budget: new Decimal(initialBudget),
    min: new Decimal(0),
    max: new Decimal(initialBudget * 5),
    quantity: new Decimal(quantity),
    unitCost: new Decimal(unitCost),
  };
}

// In this scenario, for the large service-wide budgets, we are using a symbolic approach:
// - For example, $180B for the Army is represented as 180,000 units at $1,000,000 each.
//   This is purely for demonstration of the createItem structure.

const usMillion = 1_000_000;
function createServiceItem(name, totalBudget) {
  // Representing the entire service budget as "units" each costing $1 million.
  const unitCost = usMillion;
  const quantity = totalBudget / usMillion; // e.g., $180B / $1M = 180,000 units
  return createItem(name, totalBudget, unitCost, quantity);
}

// Approximate entire defense budgets by branch (in billions of dollars):
const armyBudget = 180e9; // $180B
const navyBudget = 210e9; // $210B
const airForceBudget = 190e9; // $190B
const marineCorpsBudget = 50e9; // $50B
const spaceForceBudget = 25e9; // $25B
const defenseWideBudget = 100e9; // $100B

const congressionalSpendingTemplate = [
  {
    id: "national_defense",
    name: "National Defense (DoD)",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Army Total Budget": createServiceItem("Army Total Budget", armyBudget),
      "Navy Total Budget": createServiceItem("Navy Total Budget", navyBudget),
      "Air Force Total Budget": createServiceItem(
        "Air Force Total Budget",
        airForceBudget
      ),
      "Marine Corps Total Budget": createServiceItem(
        "Marine Corps Total Budget",
        marineCorpsBudget
      ),
      "Space Force Total Budget": createServiceItem(
        "Space Force Total Budget",
        spaceForceBudget
      ),
      "Defense-Wide Agencies": createServiceItem(
        "Defense-Wide Agencies",
        defenseWideBudget
      ),
    },
  },
  {
    id: "medicare",
    name: "Medicare",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Medicare Part A": createItem("Medicare Part A", 400e9, 10000, 40e6),
      "Medicare Part B": createItem("Medicare Part B", 300e9, 10000, 30e6),
      "Medicare Part D": createItem("Medicare Part D", 100e9, 10000, 10e6),
    },
  },
  {
    id: "social_security",
    name: "Social Security",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Old-Age & Survivors Insurance (OASI)": createItem(
        "Old-Age & Survivors Insurance (OASI)",
        900e9,
        15000,
        60e6
      ),
      "Disability Insurance (DI)": createItem(
        "Disability Insurance (DI)",
        100e9,
        10000,
        10e6
      ),
    },
  },
  {
    id: "education",
    name: "Education",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Pell Grants": createItem("Pell Grants", 30e9, 5000, 6e6),
      "K-12 Title I Grants": createItem(
        "K-12 Title I Grants",
        20e9,
        1000,
        20e6
      ),
      "Special Education (IDEA)": createItem(
        "Special Education (IDEA)",
        15e9,
        2500,
        6e6
      ),
    },
  },
  {
    id: "infrastructure",
    name: "Infrastructure (DOT)",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Highway Trust Fund": createItem("Highway Trust Fund", 60e9, 1e7, 6000),
      "FAA Grants": createItem("FAA Grants", 15e9, 1.5e7, 1000),
    },
  },
  {
    id: "veterans_affairs",
    name: "Veterans Affairs",
    total: new Decimal(0),
    expanded: true,
    items: {
      "VA Healthcare": createItem("VA Healthcare", 90e9, 9000, 10e6),
      "VA Disability Compensation": createItem(
        "VA Disability Compensation",
        100e9,
        10000,
        10e6
      ),
    },
  },
  {
    id: "homeland_security",
    name: "Homeland Security (DHS)",
    total: new Decimal(0),
    expanded: true,
    items: {
      "FEMA Disaster Relief Fund": createItem(
        "FEMA Disaster Relief Fund",
        20e9,
        2e6,
        10000
      ),
      "Customs & Border Protection (CBP)": createItem(
        "Customs & Border Protection (CBP)",
        15e9,
        150000,
        100000
      ),
    },
  },
  {
    id: "nasa",
    name: "NASA",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Artemis Program": createItem("Artemis Program", 10e9, 1e9, 10),
      "ISS Operations": createItem("ISS Operations", 3e9, 3e7, 100),
    },
  },
  {
    id: "agriculture",
    name: "Agriculture (USDA)",
    total: new Decimal(0),
    expanded: true,
    items: {
      SNAP: createItem("SNAP", 70e9, 1400, 50e6),
      "Farm Subsidies": createItem("Farm Subsidies", 20e9, 20000, 1e6),
    },
  },
  {
    id: `custom_group_1`,
    name: "Custom Group 1",
    total: new Decimal(0),
    expanded: true,
    numItems: 10,
    items: Array.from({ length: 10 }, (_, i) =>
      createItem(`Custom Item ${i + 1}`, 0, 1000000, 0)
    ),
  },
];

export default congressionalSpendingTemplate;
