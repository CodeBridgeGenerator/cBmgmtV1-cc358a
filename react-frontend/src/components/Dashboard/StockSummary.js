// import React, { useState, useEffect } from "react";
// import { Skeleton } from "primereact/skeleton";
// import { Chart } from "primereact/chart";
// import client from "../../services/restClient";

// export default function StockSummary() {
//   const [totalStockValue, setTotalStockValue] = useState(0);
//   const [currentStockLevel, setCurrentStockLevel] = useState(0);
//   const [stockValueByCategory, setStockValueByCategory] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [chartData, setChartData] = useState({});
//   const [chartOptions, setChartOptions] = useState({});

//   useEffect(() => {
//     setLoading(true);
//     const fetchStockSummary = async () => {
//       try {
//         const stockInResponse = await client.service("stockInDetails").find({
//           query: {
//             $limit: 10000,
//           },
//         });
//         const stockOutResponse = await client.service("stockOutDetails").find({
//           query: {
//             $limit: 10000,
//           },
//         });

//         // Calculate total stock value
//         const totalStockValue = stockInResponse.data.reduce(
//           (acc, item) => acc + (item.pricing || 0) * (item.quantity || 0),
//           0,
//         );
//         setTotalStockValue(totalStockValue);

//         // Calculate current stock level
//         const currentStockLevel = stockInResponse.data.reduce(
//           (acc, item) => acc + (item.quantity || 0),
//           0,
//         ) - stockOutResponse.data.reduce((acc, item) => acc + (item.quantity || 0), 0);
//         setCurrentStockLevel(currentStockLevel);

//         // Calculate stock value by category
//         const stockValueByCategory = {};
//         stockInResponse.data.forEach((item) => {
//           const category = item.category || "Uncategorized";
//           const value = (item.pricing || 0) * (item.quantity || 0);
//           stockValueByCategory[category] = (stockValueByCategory[category] || 0) + value;
//         });
//         setStockValueByCategory(stockValueByCategory);

//         // Prepare chart data
//         const categories = Object.keys(stockValueByCategory);
//         const values = categories.map((category) => stockValueByCategory[category]);

//         const documentStyle = getComputedStyle(document.documentElement);
//         const data = {
//           labels: categories,
//           datasets: [
//             {
//               label: "Stock Value by Category (RM)",
//               data: values,
//               backgroundColor: [
//                 documentStyle.getPropertyValue("--blue-500"),
//                 documentStyle.getPropertyValue("--green-500"),
//                 documentStyle.getPropertyValue("--yellow-500"),
//                 documentStyle.getPropertyValue("--red-500"),
//                 documentStyle.getPropertyValue("--purple-500"),
//               ],
//               borderColor: documentStyle.getPropertyValue("--surface-border"),
//               borderWidth: 1,
//             },
//           ],
//         };

//         const options = {
//           plugins: {
//             legend: {
//               position: "bottom",
//               labels: {
//                 color: documentStyle.getPropertyValue("--text-color"),
//               },
//             },
//             tooltip: {
//               callbacks: {
//                 label: (context) => {
//                   const label = context.dataset.label || "";
//                   const value = context.raw || 0;
//                   return `${label}: RM ${value.toFixed(2)}`;
//                 },
//                 afterLabel: (context) => {
//                   const category = context.label;
//                   const items = stockInResponse.data.filter(
//                     (item) => item.category === category,
//                   );
//                   const totalItems = items.reduce(
//                     (acc, item) => acc + (item.quantity || 0),
//                     0,
//                   );
//                   const totalValue = items.reduce(
//                     (acc, item) => acc + (item.pricing || 0) * (item.quantity || 0),
//                     0,
//                   );

//                   // Generate calculation steps
//                   const calculationSteps = items
//                     .map(
//                       (item) =>
//                         `RM ${item.pricing?.toFixed(2) || "0.00"} × ${item.quantity || 0} = RM ${(
//                           (item.pricing || 0) * (item.quantity || 0)
//                         ).toFixed(2)}`,
//                     )
//                     .join("\n");

//                   return [
//                     `Total Items: ${totalItems}`,
//                     `Calculation Steps:`,
//                     calculationSteps,
//                     `Total Value: RM ${totalValue.toFixed(2)}`,
//                   ].join("\n");
//                 },
//               },
//             },
//           },
//           scales: {
//             y: {
//               beginAtZero: true,
//               ticks: {
//                 color: documentStyle.getPropertyValue("--text-color-secondary"),
//                 callback: (value) => `RM ${value}`,
//               },
//               grid: {
//                 color: documentStyle.getPropertyValue("--surface-border"),
//               },
//               title: {
//                 display: true,
//                 text: "Stock Value (RM)",
//                 color: documentStyle.getPropertyValue("--text-color"),
//               },
//             },
//             x: {
//               ticks: {
//                 color: documentStyle.getPropertyValue("--text-color-secondary"),
//               },
//               grid: {
//                 color: documentStyle.getPropertyValue("--surface-border"),
//               },
//               title: {
//                 display: true,
//                 text: "Categories",
//                 color: documentStyle.getPropertyValue("--text-color"),
//               },
//             },
//           },
//         };

//         setChartData(data);
//         setChartOptions(options);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching stock summary:", error);
//         setLoading(false);
//       }
//     };

//     fetchStockSummary();
//   }, []);

//   return (
//     <div className="surface-card shadow-2 border-round p-3">
//       <div className="flex align-items-center">
//         <div
//           style={{
//             textAlign: "left",
//             fontSize: "14px",
//             fontWeight: "bold",
//             color: "var(--text-color)",
//             marginLeft: "0.5rem",
//           }}
//         >
//           <span className="block text-900 font-medium mb-1">Stock Summary</span>
//         </div>
//       </div>
//       {loading ? (
//         <Skeleton width="100%" height="65px" padding="10px" />
//       ) : (
//         <div>
//           <div
//             style={{
//               textAlign: "left",
//               fontSize: "25px",
//               fontWeight: "bold",
//               color: "var(--text-color)",
//               marginLeft: "0.5rem",
//             }}
//           >
//             Total Stock Value: RM {totalStockValue.toFixed(2)}
//           </div>
//           <div
//             style={{
//               textAlign: "left",
//               fontSize: "25px",
//               fontWeight: "bold",
//               color: "var(--text-color)",
//               marginLeft: "0.5rem",
//             }}
//           >
//             Current Stock Level: {currentStockLevel}
//           </div>
//           <div style={{ marginTop: "20px", height: "300px" }}>
//             <Chart
//               type="bar"
//               data={chartData}
//               options={chartOptions}
//               style={{ width: "100%", height: "100%" }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";
import { Chart } from "primereact/chart";
import client from "../../services/restClient";

export default function StockSummary() {
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [currentStockLevel, setCurrentStockLevel] = useState(0);
  const [stockValueByGroup, setStockValueByGroup] = useState({});
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setLoading(true);
    const fetchStockSummary = async () => {
      try {
        // Fetch parts_master data
        const partsMasterResponse = await client.service("partsMaster").find({
          query: {
            $limit: 10000,
          },
        });

        // Calculate total stock value and current stock level
        let totalStockValue = 0;
        let currentStockLevel = 0;
        const stockValueByGroup = {};

        partsMasterResponse.data.forEach((part) => {
          const groupKey = `${part.serialNo} - ${part.itemNo}`; // Combine serialNo and itemNo
          const value = (part.costAmount || 0) * (part.quantity || 0);

          // Accumulate total stock value and current stock level
          totalStockValue += value;
          currentStockLevel += part.quantity || 0;

          // Group by serialNo + itemNo
          stockValueByGroup[groupKey] =
            (stockValueByGroup[groupKey] || 0) + value;
        });

        setTotalStockValue(totalStockValue);
        setCurrentStockLevel(currentStockLevel);
        setStockValueByGroup(stockValueByGroup);

        // Prepare chart data
        const groups = Object.keys(stockValueByGroup);
        const values = groups.map((group) => stockValueByGroup[group]);

        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
          labels: groups,
          datasets: [
            {
              label: "Stock Value by Item Group (RM)",
              data: values,
              backgroundColor: [
                documentStyle.getPropertyValue("--blue-500"),
                documentStyle.getPropertyValue("--green-500"),
                documentStyle.getPropertyValue("--yellow-500"),
                documentStyle.getPropertyValue("--red-500"),
                documentStyle.getPropertyValue("--purple-500"),
              ],
              borderColor: documentStyle.getPropertyValue("--surface-border"),
              borderWidth: 1,
            },
          ],
        };

        const options = {
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: documentStyle.getPropertyValue("--text-color"),
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || "";
                  const value = context.raw || 0;
                  return `${label}: RM ${value.toFixed(2)}`;
                },
                afterLabel: (context) => {
                  const groupKey = context.label;
                  const items = partsMasterResponse.data.filter(
                    (part) => `${part.serialNo} - ${part.itemNo}` === groupKey,
                  );
                  const totalItems = items.reduce(
                    (acc, part) => acc + (part.quantity || 0),
                    0,
                  );
                  const totalValue = items.reduce(
                    (acc, part) =>
                      acc + (part.costAmount || 0) * (part.quantity || 0),
                    0,
                  );

                  // Generate calculation steps
                  const calculationSteps = items
                    .map(
                      (part) =>
                        `RM ${part.costAmount?.toFixed(2) || "0.00"} × ${part.quantity || 0} = RM ${(
                          (part.costAmount || 0) * (part.quantity || 0)
                        ).toFixed(2)}`,
                    )
                    .join("\n");

                  return [
                    `Total Items: ${totalItems}`,
                    `Calculation Steps:`,
                    calculationSteps,
                    `Total Value: RM ${totalValue.toFixed(2)}`,
                  ].join("\n");
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: documentStyle.getPropertyValue("--text-color-secondary"),
                callback: (value) => `RM ${value}`,
              },
              grid: {
                color: documentStyle.getPropertyValue("--surface-border"),
              },
              title: {
                display: true,
                text: "Stock Value (RM)",
                color: documentStyle.getPropertyValue("--text-color"),
              },
            },
            x: {
              ticks: {
                color: documentStyle.getPropertyValue("--text-color-secondary"),
              },
              grid: {
                color: documentStyle.getPropertyValue("--surface-border"),
              },
              title: {
                display: true,
                text: "Item Groups (Serial No - Item No)",
                color: documentStyle.getPropertyValue("--text-color"),
              },
            },
          },
        };

        setChartData(data);
        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock summary:", error);
        setLoading(false);
      }
    };

    fetchStockSummary();
  }, []);

  return (
    <div className="surface-card shadow-2 border-round p-3">
      <div className="flex align-items-center">
        <div
          style={{
            textAlign: "left",
            fontSize: "14px",
            fontWeight: "bold",
            color: "var(--text-color)",
            marginLeft: "0.5rem",
          }}
        >
          <span className="block text-900 font-medium mb-1">Stock Summary</span>
        </div>
      </div>
      {loading ? (
        <Skeleton width="100%" height="65px" padding="10px" />
      ) : (
        <div>
          <div
            style={{
              textAlign: "left",
              fontSize: "25px",
              fontWeight: "bold",
              color: "var(--text-color)",
              marginLeft: "0.5rem",
            }}
          >
            Total Stock Value: RM {totalStockValue.toFixed(2)}
          </div>
          <div
            style={{
              textAlign: "left",
              fontSize: "25px",
              fontWeight: "bold",
              color: "var(--text-color)",
              marginLeft: "0.5rem",
            }}
          >
            Current Stock Level: {currentStockLevel}
          </div>
          <div style={{ marginTop: "20px", height: "300px" }}>
            <Chart
              type="bar"
              data={chartData}
              options={chartOptions}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          {/* <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              color: "var(--text-color-secondary)",
              textAlign: "left",
              marginLeft: "0.5rem",
            }}
          >
            <strong>How it's calculated:</strong>
            <ul>
              <li>
                <strong>Total Stock Value:</strong> Sum of (Cost Amount × Quantity) for all items.
              </li>
              <li>
                <strong>Current Stock Level:</strong> Sum of all item quantities.
              </li>
              <li>
                <strong>Stock Value by Item Group:</strong> Sum of (Cost Amount × Quantity) for items grouped by Serial No + Item No.
              </li>
            </ul>
          </div> */}
        </div>
      )}
    </div>
  );
}
