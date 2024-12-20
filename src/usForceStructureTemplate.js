// usForceStructureTemplate.js

import Decimal from "decimal.js";

Decimal.set({ precision: 50 });

// Helper function to create item objects easily
function createItem(name, initialBudget, unitCost, quantity) {
  return {
    budget: new Decimal(initialBudget),
    min: new Decimal(0),
    max: new Decimal(initialBudget * 10),
    quantity: new Decimal(quantity),
    unitCost: new Decimal(unitCost),
  };
}

const usForceStructureTemplate = [
  {
    id: "strategic_nuclear_forces",
    name: "Strategic Nuclear Forces",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Minuteman III ICBMs": createItem("Minuteman III ICBMs", 3e9, 7e6, 400),
      "Ohio class SSBNs": createItem("Ohio class SSBNs", 28e9, 2e9, 14),
      "Strategic Bombers (B-2/B-21)": createItem(
        "Strategic Bombers (B-2/B-21)",
        40e9,
        2e9,
        20
      ),
    },
  },
  {
    id: "us_air_force",
    name: "U.S. Air Force",
    total: new Decimal(0),
    expanded: true,
    items: {
      // Major Aircraft
      "F-35A Fighters": createItem("F-35A Fighters", 80e9, 8e7, 1000),
      "F-15E Strike Eagles": createItem("F-15E Strike Eagles", 24e9, 8e7, 300),
      "KC-46 Tankers": createItem("KC-46 Tankers", 10e9, 1e8, 100),
      "MQ-9 Reaper UAVs": createItem("MQ-9 Reaper UAVs", 3.2e9, 1.6e7, 200),
      "B-1B Bombers": createItem("B-1B Bombers", 18e9, 3e8, 60),
      "E-3 AWACS": createItem("E-3 AWACS", 6e9, 3e8, 20),

      // Air Force Munitions (Air-delivered bombs, missiles)
      "JDAM bombs": createItem("JDAM bombs", 6e9, 30000, 200000), // ~30k each
      "AMRAAM missiles": createItem("AMRAAM missiles", 20e9, 1e6, 20000), // ~1M each
      "JASSM missiles": createItem("JASSM missiles", 10e9, 1e6, 10000), // ~1M each
      "SDB bombs": createItem("SDB bombs", 12e9, 40000, 300000), // ~40k each
    },
  },
  {
    id: "us_navy",
    name: "U.S. Navy",
    total: new Decimal(0),
    expanded: true,
    items: {
      // Major Naval Vessels
      "Ford-class Aircraft Carriers": createItem(
        "Ford-class Aircraft Carriers",
        130e9,
        1.3e10,
        10
      ),
      "Arleigh Burke Destroyers": createItem(
        "Arleigh Burke Destroyers",
        120e9,
        2e9,
        60
      ),
      "Virginia-class Submarines": createItem(
        "Virginia-class Submarines",
        90e9,
        3e9,
        30
      ),
      "Amphibious Assault Ships (Wasp-class)": createItem(
        "Amphibious Assault Ships (Wasp-class)",
        30e9,
        3e9,
        10
      ),

      // Naval Missiles
      "Tomahawk Land Attack Missiles": createItem(
        "Tomahawk Land Attack Missiles",
        6e9,
        1.5e6,
        4000
      ),
    },
  },
  {
    id: "us_army",
    name: "U.S. Army",
    total: new Decimal(0),
    expanded: true,
    items: {
      // Ground Combat Vehicles
      "M1 Abrams Tanks": createItem("M1 Abrams Tanks", 12e9, 6e6, 2000),
      "Bradley IFVs": createItem("Bradley IFVs", 12e9, 3e6, 4000),
      "Stryker Vehicles": createItem("Stryker Vehicles", 12e9, 4e6, 3000),

      // Army Air Defense & Helicopters
      HIMARS: createItem("HIMARS", 2.5e9, 5e6, 500),
      "Patriot Batteries": createItem("Patriot Batteries", 20e9, 1e9, 20),
      "Apache Helicopters": createItem("Apache Helicopters", 6e9, 3e7, 200),
      "Black Hawk Helicopters": createItem(
        "Black Hawk Helicopters",
        3e9,
        1.5e7,
        200
      ),

      // Army Artillery Systems and Munitions
      "M777 Howitzers": createItem("M777 Howitzers", 2e9, 1e6, 2000), // Army & USMC use, big Army stockpile
      "120mm Mortar Systems": createItem(
        "120mm Mortar Systems",
        1e9,
        1e6,
        1000
      ),
      "M795 155mm HE shells": createItem(
        "M795 155mm HE shells",
        2e9,
        2000,
        1000000
      ), // large Army stocks
      "M982 Excalibur shells": createItem(
        "M982 Excalibur shells",
        10e9,
        100000,
        100000
      ),

      // Army Munitions (Missiles, interceptors)
      "Hellfire missiles": createItem(
        "Hellfire missiles",
        7.5e9,
        150000,
        50000
      ), // Army for Apaches, UAVs
      "Patriot Interceptors": createItem(
        "Patriot Interceptors",
        8e9,
        4e6,
        2000
      ),

      // Army Rocket Artillery Munitions
      "Rocket artillery units": createItem(
        "Rocket artillery units",
        3e9,
        3e6,
        1000
      ), // HIMARS/MLRS launchers
      "Guided ammo (GMLRS)": createItem(
        "Guided ammo (GMLRS)",
        6e9,
        30000,
        200000
      ), // GMLRS rockets
    },
  },
  {
    id: "us_marine_corps",
    name: "U.S. Marine Corps",
    total: new Decimal(0),
    expanded: true,
    items: {
      // Marine Corps Platforms
      "Amphibious Assault Vehicles": createItem(
        "Amphibious Assault Vehicles",
        1.5e9,
        3e6,
        500
      ),
      "F-35B": createItem("F-35B", 20e9, 1e8, 200),
      "MV-22 Osprey": createItem("MV-22 Osprey", 7e9, 7e7, 100),

      // USMC Artillery and Munitions (Smaller than Army)
      "M777 Howitzers (USMC)": createItem(
        "M777 Howitzers (USMC)",
        2e8,
        1e6,
        200
      ), // Marines also use M777
      "120mm Mortar Systems (USMC)": createItem(
        "120mm Mortar Systems (USMC)",
        1e8,
        1e6,
        100
      ),
      "M795 155mm HE shells (USMC)": createItem(
        "M795 155mm HE shells (USMC)",
        2e8,
        2000,
        100000
      ),
      "M982 Excalibur shells (USMC)": createItem(
        "M982 Excalibur shells (USMC)",
        1e9,
        100000,
        10000
      ),
    },
  },
  {
    id: "us_space_force",
    name: "U.S. Space Force",
    total: new Decimal(0),
    expanded: true,
    items: {
      "GPS Satellites": createItem("GPS Satellites", 6e9, 2e8, 30),
      "Early Warning Satellites": createItem(
        "Early Warning Satellites",
        5e9,
        5e8,
        10
      ),
      "Communications Satellites": createItem(
        "Communications Satellites",
        6e9,
        3e8,
        20
      ),
    },
  },
  {
    id: "logistics_and_support",
    name: "Logistics and Support",
    total: new Decimal(0),
    expanded: true,
    items: {
      "C-17 Globemaster III": createItem(
        "C-17 Globemaster III",
        20e9,
        2e8,
        100
      ),
      "C-130J Hercules": createItem("C-130J Hercules", 16e9, 8e7, 200),
      "Heavy & Medium Tactical Vehicles": createItem(
        "Heavy & Medium Tactical Vehicles",
        3e9,
        300000,
        10000
      ),
      "Fuel Tankers (M978 HEMTT)": createItem(
        "Fuel Tankers (M978 HEMTT)",
        2.5e9,
        500000,
        5000
      ),
    },
  },
  {
    id: "radar_and_air_defense",
    name: "Radar and Air Defense",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Aegis Ashore Installations": createItem(
        "Aegis Ashore Installations",
        3.75e9,
        7.5e8,
        5
      ),
      "TPY-2 Radar Units": createItem("TPY-2 Radar Units", 3e9, 1.5e8, 20),
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

export default usForceStructureTemplate;
