// ForceStructurePlanner.jsx

import React, { useState, useEffect } from "react";
import Decimal from "decimal.js";
import { NumericFormat } from "react-number-format";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { customSmallTemplate, customBigTemplate } from "./customTemplates";
import forceStructurePlannerTemplate from "./forceStructurePlannerTemplate";
import usForceStructureTemplate from "./usForceStructureTemplate";
import congressionalSpendingTemplate from "./congressionalSpendingTemplate";
import {
  personalAndHousingBudgetTemplate,
  propertyManagementBudgetTemplate,
  smallConstructionCompanyTemplate,
  smallManufacturingCompanyTemplate,
  agTradingAndWeatherServicesTemplate,
} from "./smallBusinessandPersonal";
import "./ForceStructurePlanner.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

Decimal.set({ precision: 50 });

// Determine default unit cost for custom items based on the selected template
function getDefaultUnitCostForCustomItems(templateKey) {
  const smallerTemplates = [
    "Personal and Housing Budget",
    "Property Management Budget",
    "Small Business Construction Company",
    "Small Manufacturing Company",
    "Custom Template-Small",
    "Agricultural Data Company",
  ];
  if (smallerTemplates.includes(templateKey)) {
    return 10000; // $10,000 for smaller scale templates
  } else {
    return 1000000; // $1,000,000 for default/larger scale templates
  }
}

// Determine default max slider value for custom items based on the selected template
function getDefaultMaxForCustom(templateKey) {
  const smallerTemplates = [
    "Personal and Housing Budget",
    "Property Management Budget",
    "Small Business Construction Company",
    "Small Manufacturing Company",
    "Custom Template-Small",
    "Agricultural Data Company",
  ];
  if (smallerTemplates.includes(templateKey)) {
    return 100e6; // $100M for smaller scale templates
  } else {
    return 100e9; // $100B for larger scale templates
  }
}

// Create item helper
function createItem(name, initialBudget, unitCost, quantity) {
  return {
    name: name,
    budget: new Decimal(initialBudget),
    min: new Decimal(0),
    max: new Decimal(initialBudget > 0 ? initialBudget * 5 : 100e9),
    quantity: new Decimal(quantity),
    unitCost: new Decimal(unitCost),
  };
}

// Generate a color palette for charts
function generateColorPalette(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = (i * 137.508) % 360;
    colors.push(`hsl(${hue}, 65%, 50%)`);
  }
  return colors;
}

const COLORS_PALETTE = generateColorPalette(50);

const templates = {
  Default: {
    name: "Congressional Spending Template",
    data: congressionalSpendingTemplate,
    totalBudgetLimit: new Decimal(3.023e12),
  },
  "Force Structure Planner": {
    name: "Force Structure Planner",
    data: forceStructurePlannerTemplate,
    totalBudgetLimit: new Decimal(143e9),
  },
  "US Force Structure Template": {
    name: "US Force Structure Template",
    data: usForceStructureTemplate,
    totalBudgetLimit: new Decimal(838.45e9),
  },
  "Personal and Housing Budget": {
    name: "Personal and Housing Budget",
    data: personalAndHousingBudgetTemplate,
    totalBudgetLimit: new Decimal(5e4),
  },
  "Property Management Budget": {
    name: "Property Management Budget",
    data: propertyManagementBudgetTemplate,
    totalBudgetLimit: new Decimal(5e5),
  },
  "Small Business Construction Company": {
    name: "Small Business Construction Company",
    data: smallConstructionCompanyTemplate,
    totalBudgetLimit: new Decimal(1e6),
  },
  "Small Manufacturing Company": {
    name: "Small Manufacturing Company",
    data: smallManufacturingCompanyTemplate,
    totalBudgetLimit: new Decimal(2e6),
  },
  "Custom Template-Big": {
    name: "Custom Template-Big",
    data: customBigTemplate,
    totalBudgetLimit: new Decimal(135.7e9),
  },
  "Custom Template-Small": {
    name: "Custom Template-Small",
    data: customSmallTemplate,
    totalBudgetLimit: new Decimal(100e6),
  },
  "Agricultural Data Company": {
    name: "Agricultural Data Company",
    data: agTradingAndWeatherServicesTemplate,
    totalBudgetLimit: new Decimal(1e9),
  },
};

function ForceStructurePlanner() {
  const MAX_TOTAL_BUDGET = new Decimal(1e12);
  const smallerTemplatesList = [
    "Personal and Housing Budget",
    "Property Management Budget",
    "Small Business Construction Company",
    "Small Manufacturing Company",
    "Custom Template-Small",
    "Agricultural Data Company",
  ];

  const MAX_CUSTOM_GROUPS = 50;
  const MAX_ITEMS_PER_GROUP = 20;
  const MIN_ITEMS_PER_GROUP = 1;

  const SCALE_UNITS = {
    Standard: new Decimal(1),
    Thousands: new Decimal(1e3),
    Millions: new Decimal(1e6),
    Billions: new Decimal(1e9),
    Trillions: new Decimal(1e12),
  };

  const SCALE_ABBREVIATIONS = {
    Standard: "",
    Thousands: "K",
    Millions: "M",
    Billions: "B",
    Trillions: "T",
  };

  const [scale, setScale] = useState("Billions");
  const [customGroupCount, setCustomGroupCount] = useState(1);
  const [groupNameEdits, setGroupNameEdits] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("Default");
  const [forces, setForces] = useState(templates[selectedTemplate].data);
  const [totalBudgetLimit, setTotalBudgetLimit] = useState(
    templates[selectedTemplate].totalBudgetLimit
  );
  const [hasShownBudgetWarning, setHasShownBudgetWarning] = useState(false);
  const [totalAllocated, setTotalAllocated] = useState(new Decimal(0));
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const isSmall = smallerTemplatesList.includes(selectedTemplate);
  const MAX_SLIDER_BUDGET = isSmall ? new Decimal(1e9) : MAX_TOTAL_BUDGET;

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  function isCustomGroup(force) {
    return force.id.startsWith("custom_group");
  }

  function overrideCustomItems(forceData) {
    const maxValForCustom = getDefaultMaxForCustom(selectedTemplate);
    return forceData.map((force) => {
      if (isCustomGroup(force) && Array.isArray(force.items)) {
        const updatedItems = force.items.map((item) => {
          const newItem = { ...item, max: new Decimal(maxValForCustom) };
          return newItem;
        });
        return { ...force, items: updatedItems };
      } else {
        return force;
      }
    });
  }

  useEffect(() => {
    let newForces = templates[selectedTemplate].data;
    newForces = overrideCustomItems(newForces); // Apply overrides on initial load
    setForces(newForces);
    setTotalBudgetLimit(templates[selectedTemplate].totalBudgetLimit);
    setCustomGroupCount(
      newForces.filter((force) => isCustomGroup(force)).length
    );
  }, [selectedTemplate]);

  useEffect(() => {
    const newTotal = forces.reduce(
      (sum, force) => sum.add(calculateForceTotal(force)),
      new Decimal(0)
    );
    setTotalAllocated(newTotal);

    const pieData = forces.map((force) => ({
      name: force.name,
      value: parseFloat(calculateSubtotal(force).toFixed(2)),
    }));

    const remainingBudget = totalBudgetLimit.minus(newTotal);
    pieData.push({
      name: "Remaining Budget",
      value: remainingBudget.greaterThan(0)
        ? parseFloat(remainingBudget.toFixed(2))
        : 0,
    });

    setPieChartData(pieData);

    const barData = forces.map((force) => ({
      name: force.name,
      value: parseFloat(calculateSubtotal(force).toFixed(2)),
    }));
    setBarChartData(barData);

    if (newTotal.lte(totalBudgetLimit)) {
      setHasShownBudgetWarning(false);
    }
  }, [forces, totalBudgetLimit]);

  const calculateForceTotal = (force) =>
    Array.isArray(force.items)
      ? force.items.reduce(
          (sum, item) => sum.add(item.budget || 0),
          new Decimal(0)
        )
      : Object.values(force.items).reduce(
          (sum, item) => sum.add(item.budget || 0),
          new Decimal(0)
        );

  const calculateSubtotal = (force) => calculateForceTotal(force);

  const formatScaledValue = (value, decimalPlaces = 2) => {
    const multiplier = SCALE_UNITS[scale];
    const scaledValue = value.div(multiplier);
    const abbreviation = SCALE_ABBREVIATIONS[scale];
    return `$${formatNumber(
      scaledValue.toFixed(decimalPlaces)
    )}${abbreviation}`;
  };

  const formatItemBudget = (value, decimalPlaces = 2) => {
    const multiplier = SCALE_UNITS[scale];
    const scaledValue = value.div(multiplier);
    const abbreviation = SCALE_ABBREVIATIONS[scale];
    return `Item Budget: $${formatNumber(
      scaledValue.toFixed(decimalPlaces)
    )}${abbreviation}`;
  };

  const formatNumber = (numberString) => {
    const parts = numberString.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const getScaledBudget = (value) => {
    const multiplier = SCALE_UNITS[scale];
    return value.div(multiplier).toNumber();
  };

  const parseNumberInput = (input) => new Decimal(input || "0");

  const getBudgetStep = () => 0.000001;

  const handleSavePrint = async () => {
    const element = document.querySelector(".force-planner");
    if (!element) {
      alert("Unable to find the element to print.");
      return;
    }

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "letter");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const originalCanvasWidth = canvas.width;
    const originalCanvasHeight = canvas.height;
    const imgHeight = (originalCanvasHeight * imgWidth) / originalCanvasWidth;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      const scaleFactor = imgWidth / originalCanvasWidth;
      const sliceHeightInPx = pageHeight / scaleFactor;
      const pageCount = Math.ceil(imgHeight / pageHeight);

      for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const startY = pageIndex * sliceHeightInPx;
        const sliceHeight = Math.min(
          sliceHeightInPx,
          originalCanvasHeight - startY
        );

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = originalCanvasWidth;
        tempCanvas.height = sliceHeight;

        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(
          canvas,
          0,
          startY,
          originalCanvasWidth,
          sliceHeight,
          0,
          0,
          originalCanvasWidth,
          sliceHeight
        );

        const tempImgData = tempCanvas.toDataURL("image/png");
        const sliceImgHeight = sliceHeight * scaleFactor;

        pdf.addImage(tempImgData, "PNG", 0, 0, imgWidth, sliceImgHeight);
      }
    }

    pdf.save("ForceStructurePlanner.pdf");
  };

  const handleImportExcel = () => {
    alert("Import Excel feature is not implemented yet.");
  };

  const handleExportExcel = () => {
    alert("Export Excel feature is not implemented yet.");
  };

  const updateBudget = (groupId, itemKey, newBudget) => {
    setForces((prevForces) =>
      prevForces.map((force) => {
        if (force.id !== groupId) return force;
        let updatedItems;
        if (Array.isArray(force.items)) {
          const item = force.items[itemKey];
          const newQuantity = newBudget.div(item.unitCost).floor();
          updatedItems = force.items.map((itm, idx) =>
            idx === itemKey
              ? { ...itm, budget: newBudget, quantity: newQuantity }
              : itm
          );
        } else {
          const item = force.items[itemKey];
          const newQuantity = newBudget.div(item.unitCost).floor();
          updatedItems = {
            ...force.items,
            [itemKey]: { ...item, budget: newBudget, quantity: newQuantity },
          };
        }
        return { ...force, items: updatedItems };
      })
    );
  };

  const handleQuantityChange = (value, forceId, itemKey) => {
    const newQuantity = new Decimal(value || "0").floor();
    setForces((prevForces) =>
      prevForces.map((force) => {
        if (force.id !== forceId) return force;
        if (Array.isArray(force.items)) {
          const newArray = force.items.map((item, idx) => {
            if (idx !== itemKey) return item;
            const newBudget = newQuantity.mul(item.unitCost).toDecimalPlaces(2);
            return { ...item, quantity: newQuantity, budget: newBudget };
          });
          return { ...force, items: newArray };
        } else {
          const oldItem = force.items[itemKey];
          const newBudget = newQuantity
            .mul(oldItem.unitCost)
            .toDecimalPlaces(2);
          return {
            ...force,
            items: {
              ...force.items,
              [itemKey]: {
                ...oldItem,
                quantity: newQuantity,
                budget: newBudget,
              },
            },
          };
        }
      })
    );
  };

  const handleUnitCostChange = (value, forceId, itemKey) => {
    const newUnitCost = new Decimal(value || "0").toDecimalPlaces(2);
    setForces((prevForces) =>
      prevForces.map((force) => {
        if (force.id !== forceId) return force;
        if (Array.isArray(force.items)) {
          const newArray = force.items.map((item, idx) => {
            if (idx !== itemKey) return item;
            const newBudget = item.quantity.mul(newUnitCost).toDecimalPlaces(2);
            return { ...item, unitCost: newUnitCost, budget: newBudget };
          });
          return { ...force, items: newArray };
        } else {
          const oldItem = force.items[itemKey];
          const newBudget = oldItem.quantity
            .mul(newUnitCost)
            .toDecimalPlaces(2);
          return {
            ...force,
            items: {
              ...force.items,
              [itemKey]: {
                ...oldItem,
                unitCost: newUnitCost,
                budget: newBudget,
              },
            },
          };
        }
      })
    );
  };

  const handleDeleteItem = (forceId, itemKey) => {
    setForces((prevForces) =>
      prevForces.map((force) => {
        if (force.id !== forceId) return force;
        if (Array.isArray(force.items)) {
          const updatedItems = force.items.filter((_, idx) => idx !== itemKey);
          let updatedForce = { ...force, items: updatedItems };
          if (isCustomGroup(force)) {
            const newNumItems = Math.min(force.numItems, updatedItems.length);
            updatedForce.numItems = newNumItems;
          }
          return updatedForce;
        } else {
          const updatedItems = { ...force.items };
          delete updatedItems[itemKey];
          return { ...force, items: updatedItems };
        }
      })
    );
  };

  const handleAddItem = (forceId) => {
    const itemName = prompt("Enter a name for the new item:");
    if (!itemName || !itemName.trim()) return;

    const smallerTemplates = [
      "Personal and Housing Budget",
      "Property Management Budget",
      "Small Business Construction Company",
      "Small Manufacturing Company",
    ];
    const unitCostForCustom =
      getDefaultUnitCostForCustomItems(selectedTemplate);

    setForces((prevForces) => {
      const newForces = prevForces.map((force) => {
        if (force.id !== forceId) return force;
        const newItem = createItem(
          itemName.trim(),
          0,
          smallerTemplates.includes(selectedTemplate)
            ? unitCostForCustom
            : isCustomGroup(force)
            ? unitCostForCustom
            : 1000000,
          0
        );

        if (smallerTemplates.includes(selectedTemplate)) {
          newItem.max = new Decimal(100e6);
        }

        if (Array.isArray(force.items)) {
          const updatedItems = [...force.items, newItem];
          let updatedForce = { ...force, items: updatedItems };
          if (isCustomGroup(force)) {
            updatedForce.numItems = force.numItems + 1;
          }
          return updatedForce;
        } else {
          return {
            ...force,
            items: { ...force.items, [itemName.trim()]: newItem },
          };
        }
      });
      return overrideCustomItems(newForces);
    });
  };

  const handleGroupNameChange = (groupId, newName) => {
    setGroupNameEdits((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], name: newName },
    }));
  };

  const updateGroupName = (groupId) => {
    const newName = groupNameEdits[groupId]?.name || "";
    if (!newName.trim()) return;
    setForces((prevForces) =>
      prevForces.map((force) =>
        force.id === groupId ? { ...force, name: newName } : force
      )
    );
    setGroupNameEdits((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], isEditing: false },
    }));
  };

  const handleDeleteGroup = (groupId) => {
    const deletedForce = forces.find((f) => f.id === groupId);
    setForces((prevForces) =>
      prevForces.filter((force) => force.id !== groupId)
    );
    if (deletedForce && isCustomGroup(deletedForce)) {
      setCustomGroupCount((prevCount) => prevCount - 1);
    }
  };

  const handleNumItemsChange = (groupId, newNumItems) => {
    newNumItems = Math.max(
      MIN_ITEMS_PER_GROUP,
      Math.min(MAX_ITEMS_PER_GROUP, newNumItems)
    );
    const unitCostForCustom =
      getDefaultUnitCostForCustomItems(selectedTemplate);
    setForces((prevForces) => {
      let newForces = prevForces.map((force) => {
        if (force.id !== groupId || !isCustomGroup(force)) return force;
        let updatedItems = [...force.items];
        if (newNumItems < updatedItems.length) {
          updatedItems = updatedItems.slice(0, newNumItems);
        } else if (newNumItems > updatedItems.length) {
          const itemsToAdd = Array.from(
            { length: newNumItems - updatedItems.length },
            (_, i) =>
              createItem(
                `Custom Item ${updatedItems.length + i + 1}`,
                0,
                unitCostForCustom,
                0
              )
          );
          updatedItems = [...updatedItems, ...itemsToAdd];
        }
        return { ...force, numItems: newNumItems, items: updatedItems };
      });
      return overrideCustomItems(newForces);
    });
  };

  const toggleExpand = (groupId) => {
    setForces((prevForces) =>
      prevForces.map((force) =>
        force.id === groupId ? { ...force, expanded: !force.expanded } : force
      )
    );
  };

  return (
    <div className="force-planner">
      <header className="header">
        <h1>The Best Budgeting Tool</h1>
        <div className="top-actions">
          <button onClick={handleSavePrint}>Save/Print</button>
          <button onClick={handleImportExcel}>Import Excel</button>
          <button onClick={handleExportExcel}>Export Excel</button>
        </div>
        <div className="template-selector">
          <label>Select Template: </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            {Object.keys(templates).map((templateKey) => (
              <option key={templateKey} value={templateKey}>
                {templates[templateKey].name}
              </option>
            ))}
          </select>
        </div>

        <div className="charts-container">
          <div className="chart">
            <h3>Budget Allocation - Pie Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.name === "Remaining Budget"
                          ? "#d3d3d3"
                          : COLORS_PALETTE[index % 50]
                      }
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [
                    formatItemBudget(new Decimal(value)),
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart">
            <h3>Budget Allocation - Bar Chart</h3>
            <ResponsiveContainer width="80%" height={300}>
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 20, left: 60 }}
              >
                <XAxis dataKey="name" tick={false} />
                <YAxis
                  tickFormatter={(value) =>
                    formatScaledValue(new Decimal(value), 0)
                  }
                />
                <RechartsTooltip
                  formatter={(value, name) => [
                    formatItemBudget(new Decimal(value)),
                    name,
                  ]}
                />
                <Bar dataKey="value">
                  {barChartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS_PALETTE[index % 50]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="budget-controls">
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "1.5em",
              marginBottom: "0.5em",
            }}
          >
            Adjust Total Budget
          </h2>

          <span>
            Total:{" "}
            <NumericFormat
              value={getScaledBudget(totalBudgetLimit).toString()}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              allowNegative={false}
              prefix="$"
              suffix={SCALE_ABBREVIATIONS[scale]}
              onValueChange={(values) => {
                const { value: newValue } = values;
                const numericValue = new Decimal(newValue || "0");
                const newTotalBudget = numericValue.mul(SCALE_UNITS[scale]);
                setTotalBudgetLimit(newTotalBudget);
              }}
              className="total-budget-input"
              displayType="input"
            />
          </span>

          <span>
            {" "}
            | Allocated: {formatScaledValue(totalAllocated)} | Remaining:{" "}
            {formatScaledValue(totalBudgetLimit.minus(totalAllocated))}
          </span>
          <input
            type="range"
            value={getScaledBudget(totalBudgetLimit)}
            min={0}
            max={getScaledBudget(MAX_SLIDER_BUDGET)}
            step={getBudgetStep()}
            onChange={(e) => {
              const newTotalBudgetScaled = new Decimal(e.target.value);
              const newTotalBudget = newTotalBudgetScaled.mul(
                SCALE_UNITS[scale]
              );
              setTotalBudgetLimit(newTotalBudget);
            }}
          />
          <span>
            Range: {formatScaledValue(new Decimal(0))} -{" "}
            {formatScaledValue(MAX_SLIDER_BUDGET)}
          </span>
        </div>

        <div className="scale-selector">
          <label>Scale: </label>
          <select value={scale} onChange={(e) => setScale(e.target.value)}>
            {Object.keys(SCALE_UNITS).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </header>
      <div className="content">
        {forces.map((force) => (
          <div key={force.id} className="force-section">
            <div className="force-header">
              <div
                className="force-title"
                onClick={() => toggleExpand(force.id)}
                style={{ textAlign: "center", cursor: "pointer" }}
              >
                {isCustomGroup(force) ? (
                  groupNameEdits[force.id]?.isEditing ? (
                    <input
                      type="text"
                      value={groupNameEdits[force.id].name}
                      onChange={(e) =>
                        handleGroupNameChange(force.id, e.target.value)
                      }
                      onBlur={() => {
                        if (groupNameEdits[force.id].name.trim() !== "") {
                          updateGroupName(force.id);
                        } else {
                          setGroupNameEdits((prev) => ({
                            ...prev,
                            [force.id]: {
                              ...prev[force.id],
                              isEditing: false,
                            },
                          }));
                        }
                      }}
                      className="custom-group-name-input"
                      autoFocus
                    />
                  ) : (
                    <h2
                      className="custom-group-name-heading"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGroupNameEdits((prev) => ({
                          ...prev,
                          [force.id]: { name: force.name, isEditing: true },
                        }));
                      }}
                    >
                      {force.name}
                    </h2>
                  )
                ) : (
                  <h2>{force.name}</h2>
                )}
                {force.expanded ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
              <div className="force-subheader">
                <div className="subtotal-budget">
                  {formatItemBudget(calculateSubtotal(force))}
                </div>
                <div className="group-actions">
                  {isCustomGroup(force) && (
                    <label>
                      Number of Items:
                      <input
                        type="number"
                        min={MIN_ITEMS_PER_GROUP}
                        max={MAX_ITEMS_PER_GROUP}
                        value={force.numItems}
                        onChange={(e) =>
                          handleNumItemsChange(
                            force.id,
                            parseInt(e.target.value) || MIN_ITEMS_PER_GROUP
                          )
                        }
                        className="num-items-input"
                      />
                    </label>
                  )}
                  <button
                    className="delete-group-button"
                    onClick={() => handleDeleteGroup(force.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    className="add-item-button"
                    onClick={() => handleAddItem(force.id)}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
            {force.expanded && (
              <div className="force-items">
                {Array.isArray(force.items)
                  ? force.items.slice(0, force.numItems).map((item, index) => (
                      <div key={index} className="item">
                        <div className="item-header">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setForces((prevForces) =>
                                prevForces.map((f) => {
                                  if (f.id !== force.id) return f;
                                  const updatedItems = f.items.map((itm, idx) =>
                                    idx === index
                                      ? { ...itm, name: newName }
                                      : itm
                                  );
                                  return { ...f, items: updatedItems };
                                })
                              );
                            }}
                            className="custom-name-input"
                          />
                          <span>{formatItemBudget(item.budget)}</span>
                          <button
                            className="delete-item-button"
                            onClick={() => handleDeleteItem(force.id, index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <input
                          type="range"
                          value={getScaledBudget(item.budget)}
                          min={getScaledBudget(item.min)}
                          max={getScaledBudget(item.max)}
                          step={getBudgetStep()}
                          onChange={(e) => {
                            const newBudgetScaled = new Decimal(e.target.value);
                            const newBudget = newBudgetScaled.mul(
                              SCALE_UNITS[scale]
                            );
                            updateBudget(force.id, index, newBudget);
                          }}
                        />
                        <div className="item-details">
                          <span>
                            Quantity:
                            <NumericFormat
                              value={item.quantity.toString()}
                              thousandSeparator={true}
                              onValueChange={(values) => {
                                const { value } = values;
                                handleQuantityChange(value, force.id, index);
                              }}
                              className="quantity-input"
                              displayType="input"
                              allowNegative={false}
                              decimalScale={0}
                              fixedDecimalScale={true}
                            />
                          </span>
                          <span>
                            Unit Cost:
                            <NumericFormat
                              value={item.unitCost.toString()}
                              thousandSeparator={true}
                              prefix="$"
                              decimalScale={2}
                              fixedDecimalScale={true}
                              onValueChange={(values) => {
                                const { value } = values;
                                handleUnitCostChange(value, force.id, index);
                              }}
                              className="unit-cost-input"
                              displayType="input"
                              allowNegative={false}
                            />
                          </span>
                        </div>
                      </div>
                    ))
                  : Object.entries(force.items).map(([name, item]) => {
                      if (!item.name) {
                        item.name = name;
                      }
                      return (
                        <div key={name} className="item">
                          <div className="item-header">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setForces((prevForces) =>
                                  prevForces.map((f) => {
                                    if (f.id !== force.id) return f;
                                    const updatedItems = { ...f.items };
                                    updatedItems[name] = {
                                      ...updatedItems[name],
                                      name: newName,
                                    };
                                    return { ...f, items: updatedItems };
                                  })
                                );
                              }}
                              className="custom-name-input"
                            />
                            <span>{formatItemBudget(item.budget)}</span>
                            <button
                              className="delete-item-button"
                              onClick={() => handleDeleteItem(force.id, name)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <input
                            type="range"
                            value={getScaledBudget(item.budget)}
                            min={getScaledBudget(item.min)}
                            max={getScaledBudget(item.max)}
                            step={getBudgetStep()}
                            onChange={(e) => {
                              const newBudgetScaled = new Decimal(
                                e.target.value
                              );
                              const newBudget = newBudgetScaled.mul(
                                SCALE_UNITS[scale]
                              );
                              updateBudget(force.id, name, newBudget);
                            }}
                          />
                          <div className="item-details">
                            <span>
                              Quantity:
                              <NumericFormat
                                value={item.quantity.toString()}
                                thousandSeparator={true}
                                onValueChange={(values) => {
                                  const { value } = values;
                                  handleQuantityChange(value, force.id, name);
                                }}
                                className="quantity-input"
                                displayType="input"
                                allowNegative={false}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              />
                            </span>
                            <span>
                              Unit Cost:
                              <NumericFormat
                                value={item.unitCost.toString()}
                                thousandSeparator={true}
                                prefix="$"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                onValueChange={(values) => {
                                  const { value } = values;
                                  handleUnitCostChange(value, force.id, name);
                                }}
                                className="unit-cost-input"
                                displayType="input"
                                allowNegative={false}
                              />
                            </span>
                          </div>
                        </div>
                      );
                    })}
              </div>
            )}
          </div>
        ))}
        <div className="create-custom-group-wrapper">
          <button
            className="create-custom-group"
            onClick={() => {
              if (customGroupCount < MAX_CUSTOM_GROUPS) {
                const smallerTemplates = [
                  "Personal and Housing Budget",
                  "Property Management Budget",
                  "Small Business Construction Company",
                  "Small Manufacturing Company",
                ];
                const unitCostForCustom =
                  getDefaultUnitCostForCustomItems(selectedTemplate);
                const maxValForCustom =
                  getDefaultMaxForCustom(selectedTemplate);
                const newCustomGroupId = `custom_group_${customGroupCount + 1}`;
                const newCustomGroupItems = Array.from(
                  { length: 10 },
                  (_, i) => {
                    const itm = createItem(
                      `Custom Item ${i + 1}`,
                      0,
                      unitCostForCustom,
                      0
                    );
                    itm.max = new Decimal(maxValForCustom);
                    return itm;
                  }
                );
                const newCustomGroup = {
                  id: newCustomGroupId,
                  name: `Custom Group ${customGroupCount + 1}`,
                  total: new Decimal(0),
                  expanded: true,
                  numItems: 10,
                  items: newCustomGroupItems,
                };
                setCustomGroupCount((prevCount) => prevCount + 1);
                setForces((prevForces) => [...prevForces, newCustomGroup]);
              } else {
                alert(
                  `You can only have up to ${MAX_CUSTOM_GROUPS} custom groups.`
                );
              }
            }}
            disabled={customGroupCount >= MAX_CUSTOM_GROUPS}
          >
            Create New Custom Group
          </button>
        </div>
      </div>

      {/* Floating charts bubble */}
      <div
        className="chart-bubble"
        onClick={() => setIsTooltipVisible((prev) => !prev)}
      >
        <div className="bubble-icon">Charts</div>
        {isTooltipVisible && (
          <div className="bubble-tooltip">
            <h3>Budget Allocation - Pie Chart</h3>
            <div className="tooltip-chart-wrapper">
              <ResponsiveContainer width="80%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.name === "Remaining Budget"
                            ? "#d3d3d3"
                            : COLORS_PALETTE[index % 50]
                        }
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name) => [
                      formatItemBudget(new Decimal(value)),
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <h3>Budget Allocation - Bar Chart</h3>
            <div className="tooltip-chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 20, left: 20 }}
                >
                  <XAxis dataKey="name" tick={false} />
                  <YAxis
                    tickFormatter={(value) =>
                      formatScaledValue(new Decimal(value), 0)
                    }
                  />
                  <RechartsTooltip
                    formatter={(value, name) => [
                      formatItemBudget(new Decimal(value)),
                      name,
                    ]}
                  />
                  <Bar dataKey="value">
                    {barChartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS_PALETTE[index % 50]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForceStructurePlanner;
