// smallBusinessandPersonal.js

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

/**
 * Deletes an item from a given template.
 *
 * @param {Array} template - The template array to modify.
 * @param {string} categoryId - The ID of the category to find.
 * @param {string} itemName - The name of the item to delete.
 * @returns {boolean} - Returns true if the item was found and deleted, false otherwise.
 */
function deleteItemFromTemplate(template, categoryId, itemName) {
  // Find the category by ID
  const category = template.find((cat) => cat.id === categoryId);
  if (!category || !category.items) return false;

  // Check if the item exists
  if (!category.items[itemName]) return false;

  // Delete the item
  delete category.items[itemName];
  return true;
}

// ----------------------------------------
// Personal and Housing Budget Template
// ----------------------------------------
const personalAndHousingBudgetTemplate = [
  {
    id: "housing_and_utilities",
    name: "Housing & Utilities",
    total: new Decimal(0),
    expanded: true,
    items: {
      Rent: createItem("Rent", 14400, 1200, 12),
      Electricity: createItem("Electricity", 1200, 100, 12),
      Water: createItem("Water", 600, 50, 12),
      Internet: createItem("Internet", 720, 60, 12),
    },
  },
  {
    id: "food_groceries",
    name: "Food & Groceries",
    total: new Decimal(0),
    expanded: true,
    items: {
      Groceries: createItem("Groceries", 6000, 500, 12),
    },
  },
  {
    id: "transportation",
    name: "Transportation",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Car Payment": createItem("Car Payment", 3600, 300, 12),
      Fuel: createItem("Fuel", 1800, 150, 12),
      Maintenance: createItem("Maintenance", 500, 500, 1),
    },
  },
  {
    id: "personal_expenses",
    name: "Personal Expenses",
    total: new Decimal(0),
    expanded: true,
    items: {
      Clothing: createItem("Clothing", 1000, 1000, 1),
      Entertainment: createItem("Entertainment", 1200, 100, 12),
      Healthcare: createItem("Healthcare", 2400, 200, 12),
      Insurance: createItem("Insurance", 1500, 1500, 1),
    },
  },
  {
    id: "custom_group_1",
    name: "Custom Group 1",
    total: new Decimal(0),
    expanded: true,
    numItems: 10,
    items: Array.from({ length: 10 }, (_, i) =>
      createItem(`Custom Item ${i + 1}`, 0, 10000, 0)
    ),
  },
];

// ----------------------------------------
// Property Management Budget Template
// ----------------------------------------
const propertyManagementBudgetTemplate = [
  {
    id: "property_taxes_insurance",
    name: "Property Taxes & Insurance",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Property Taxes": createItem("Property Taxes", 50000, 50000, 1),
      "Property Insurance": createItem("Property Insurance", 30000, 30000, 1),
    },
  },
  {
    id: "maintenance_repairs",
    name: "Maintenance & Repairs",
    total: new Decimal(0),
    expanded: true,
    items: {
      "General Maintenance": createItem("General Maintenance", 80000, 2000, 40),
    },
  },
  {
    id: "utilities_common",
    name: "Utilities (Common Areas)",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Common Area Utilities": createItem(
        "Common Area Utilities",
        20000,
        1000,
        20
      ),
    },
  },
  {
    id: "management_fees_admin",
    name: "Management Fees & Admin",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Management Fees": createItem("Management Fees", 60000, 5000, 12),
    },
  },
  {
    id: "capital_improvements",
    name: "Capital Improvements",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Capital Improvements": createItem(
        "Capital Improvements",
        100000,
        50000,
        2
      ),
    },
  },
  {
    id: "marketing_leasing",
    name: "Marketing & Leasing",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Marketing Costs": createItem("Marketing Costs", 10000, 1000, 10),
    },
  },
  {
    id: "custom_group_1",
    name: "Custom Group 1",
    total: new Decimal(0),
    expanded: true,
    numItems: 10,
    items: Array.from({ length: 10 }, (_, i) =>
      createItem(`Custom Item ${i + 1}`, 0, 10000, 0)
    ),
  },
];

// ----------------------------------------
// Small Business Construction Company Template
// ----------------------------------------
const smallConstructionCompanyTemplate = [
  {
    id: "office_admin",
    name: "Office & Admin",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Office Rent & Utilities": createItem(
        "Office Rent & Utilities",
        60000,
        5000,
        12
      ),
    },
  },
  {
    id: "equipment_tools",
    name: "Equipment & Tools",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Equipment & Tools": createItem("Equipment & Tools", 50000, 5000, 10),
    },
  },
  {
    id: "materials",
    name: "Materials",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Construction Materials": createItem(
        "Construction Materials",
        200000,
        2000,
        100
      ),
    },
  },
  {
    id: "labor_payroll",
    name: "Labor Payroll",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Crew Wages": createItem("Crew Wages", 500000, 50000, 10),
    },
  },
  {
    id: "insurance_permits",
    name: "Insurance & Permits",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Insurance & Permits": createItem("Insurance & Permits", 30000, 3000, 10),
    },
  },
  {
    id: "vehicles_fuel",
    name: "Vehicles & Fuel",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Vehicles & Fuel": createItem("Vehicles & Fuel", 40000, 4000, 10),
    },
  },
  {
    id: "marketing_advertising",
    name: "Marketing & Advertising",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Local Advertising": createItem("Local Advertising", 10000, 1000, 10),
    },
  },
  {
    id: "accounting_legal",
    name: "Accounting & Legal",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Accounting & Legal Services": createItem(
        "Accounting & Legal Services",
        20000,
        2000,
        10
      ),
    },
  },
  {
    id: "training_safety",
    name: "Training & Safety",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Training & Safety": createItem("Training & Safety", 5000, 500, 10),
    },
  },
  {
    id: "custom_group_1",
    name: "Custom Group 1",
    total: new Decimal(0),
    expanded: true,
    numItems: 10,
    items: Array.from({ length: 10 }, (_, i) =>
      createItem(`Custom Item ${i + 1}`, 0, 10000, 0)
    ),
  },
];

// ----------------------------------------
// Small Manufacturing Company Template
// ----------------------------------------
const smallManufacturingCompanyTemplate = [
  {
    id: "factory_overhead",
    name: "Factory & Overhead",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Factory Rent & Utilities": createItem(
        "Factory Rent & Utilities",
        100000,
        10000,
        10
      ),
    },
  },
  {
    id: "machinery_maintenance",
    name: "Machinery Maintenance & Upgrades",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Machinery Maintenance": createItem(
        "Machinery Maintenance",
        50000,
        5000,
        10
      ),
    },
  },
  {
    id: "raw_materials_inventory",
    name: "Raw Materials & Inventory",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Raw Materials": createItem("Raw Materials", 300000, 3000, 100),
    },
  },
  {
    id: "labor_payroll",
    name: "Labor Payroll",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Factory Crew Wages": createItem("Factory Crew Wages", 600000, 50000, 12),
    },
  },
  {
    id: "shipping_distribution",
    name: "Shipping & Distribution",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Shipping & Distribution": createItem(
        "Shipping & Distribution",
        80000,
        8000,
        10
      ),
    },
  },
  {
    id: "rnd_product_development",
    name: "R&D & Product Development",
    total: new Decimal(0),
    expanded: true,
    items: {
      "R&D Expenses": createItem("R&D Expenses", 40000, 4000, 10),
    },
  },
  {
    id: "sales_marketing",
    name: "Sales & Marketing",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Sales & Marketing Costs": createItem(
        "Sales & Marketing Costs",
        60000,
        6000,
        10
      ),
    },
  },
  {
    id: "it_security",
    name: "IT & Security",
    total: new Decimal(0),
    expanded: true,
    items: {
      "IT & Security Services": createItem(
        "IT & Security Services",
        20000,
        2000,
        10
      ),
    },
  },
  {
    id: "accounting_legal",
    name: "Accounting & Legal",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Accounting & Legal Services": createItem(
        "Accounting & Legal Services",
        30000,
        3000,
        10
      ),
    },
  },
  {
    id: "custom_group_1",
    name: "Custom Group 1",
    total: new Decimal(0),
    expanded: true,
    numItems: 10,
    items: Array.from({ length: 10 }, (_, i) =>
      createItem(`Custom Item ${i + 1}`, 0, 10000, 0)
    ),
  },
];

// ----------------------------------------
// Ag, Trading, and Weather Services Business Budget Template
// ----------------------------------------
const agTradingAndWeatherServicesTemplate = [
  {
    id: "weather_data_forecasting",
    name: "Weather Data & Forecasting",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Weather Data Subscription": createItem(
        "Weather Data Subscription",
        120e6,
        10000,
        12000
      ),
      "Weather API Calls (Usage)": createItem(
        "Weather API Calls (Usage)",
        50e6,
        500,
        100e3
      ),
      "Forecasting System Maintenance": createItem(
        "Forecasting System Maintenance",
        60e6,
        5000,
        12000
      ),
    },
  },
  {
    id: "ag_data_feeds_analytics",
    name: "Agricultural Data Feeds & Analytics",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Soil & Yield Data Subscription": createItem(
        "Soil & Yield Data Subscription",
        36e6,
        3000,
        12000
      ),
      "Satellite Imagery (Usage)": createItem(
        "Satellite Imagery (Usage)",
        60e6,
        600,
        100e3
      ),
      "Farming Best-Practices Content": createItem(
        "Farming Best-Practices Content",
        12e6,
        1000,
        12000
      ),
    },
  },
  {
    id: "commodity_market_data_trading_tools",
    name: "Commodity Market Data & Trading Tools",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Commodity Price Feed Subscription": createItem(
        "Commodity Price Feed Subscription",
        48e6,
        4000,
        12000
      ),
      "Trading Platform Fees": createItem(
        "Trading Platform Fees",
        24e6,
        2000,
        12000
      ),
      "Historical Data Downloads (Usage)": createItem(
        "Historical Data Downloads (Usage)",
        30e6,
        600,
        50000
      ),
    },
  },
  {
    id: "sales_client_services",
    name: "Sales & Client Services",
    total: new Decimal(0),
    expanded: true,
    items: {
      "CRM & Customer Support": createItem(
        "CRM & Customer Support",
        24e6,
        2000,
        12000
      ),
      "Marketing Campaigns": createItem("Marketing Campaigns", 60000, 5000, 12),
      "Client Acquisition (Travel/Events)": createItem(
        "Client Acquisition (Travel/Events)",
        30e6,
        3000,
        10000
      ),
    },
  },
  {
    id: "it_security",
    name: "IT & Security",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Cloud Server Hosting (Usage)": createItem(
        "Cloud Server Hosting (Usage)",
        50e6,
        500,
        100e3
      ),
      "Cybersecurity Tools Subscription": createItem(
        "Cybersecurity Tools Subscription",
        12e6,
        1000,
        12000
      ),
      "Data Backup & Storage": createItem(
        "Data Backup & Storage",
        18e6,
        1500,
        12000
      ),
    },
  },
  {
    id: "subscription_mgmt_billing",
    name: "Subscription Management & Billing",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Billing Software Subscription": createItem(
        "Billing Software Subscription",
        60e6,
        500,
        12000
      ),
      "Payment Gateway Fees (Usage)": createItem(
        "Payment Gateway Fees (Usage)",
        24e6,
        400,
        60e3
      ),
    },
  },
  {
    id: "rnd_product_development",
    name: "R&D & Product Development",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Data Science Tools": createItem("Data Science Tools", 24000, 2000, 12),
      "AI Model Development Subscription": createItem(
        "AI Model Development Subscription",
        36e6,
        3000,
        12000
      ),
      "Product Testing Funds": createItem(
        "Product Testing Funds",
        20e6,
        2000,
        10000
      ),
    },
  },
  {
    id: "accounting_legal",
    name: "Accounting & Legal",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Accounting Services Subscription": createItem(
        "Accounting Services Subscription",
        12e6,
        1000,
        12000
      ),
      "Legal Consultation (Usage)": createItem(
        "Legal Consultation (Usage)",
        15e6,
        500,
        30e3
      ),
    },
  },
  {
    id: "custom_group_1",
    name: "Custom Group 1",
    total: new Decimal(0),
    expanded: true,
    numItems: 10,
    items: Array.from({ length: 10 }, (_, i) =>
      createItem(`Custom Item ${i + 1}`, 0, 10000, 0)
    ),
  },
];

// Exporting all templates and the helper functions
export {
  createItem,
  deleteItemFromTemplate,
  personalAndHousingBudgetTemplate,
  propertyManagementBudgetTemplate,
  smallConstructionCompanyTemplate,
  smallManufacturingCompanyTemplate,
  agTradingAndWeatherServicesTemplate, // newly added template
};
