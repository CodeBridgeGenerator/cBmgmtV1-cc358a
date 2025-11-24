import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";
import { Chart } from "primereact/chart";
import client from "../../services/restClient";

export default function StockUtilizationRate() {
  const [utilizationRate, setUtilizationRate] = useState(0);
  const [monthlyUsage, setMonthlyUsage] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setLoading(true);
    const fetchStockUtilizationRate = async () => {
      try {
        const stockInResponse = await client.service("stockInDetails").find({
          query: {
            $limit: 10000,
          },
        });
        const stockOutResponse = await client.service("stockOutDetails").find({
          query: {
            $limit: 10000,
          },
        });

        // Calculate total stock in and out
        const totalStockIn = stockInResponse.data.reduce(
          (acc, item) => acc + (item.quantity || 0),
          0,
        );
        const totalStockOut = stockOutResponse.data.reduce(
          (acc, item) => acc + (item.quantity || 0),
          0,
        );

        // Calculate utilization rate
        const utilizationRate = (totalStockOut / totalStockIn) * 100;
        setUtilizationRate(utilizationRate);

        // Calculate monthly usage and stock levels
        const monthlyUsageData = {};
        const stockLevelsData = {};

        stockOutResponse.data.forEach((item) => {
          const month = new Date(item.stockOutDate).toLocaleString("default", {
            month: "short",
          });
          monthlyUsageData[month] =
            (monthlyUsageData[month] || 0) + (item.quantity || 0);
        });

        stockInResponse.data.forEach((item) => {
          const month = new Date(item.purchaseDate).toLocaleString("default", {
            month: "short",
          });
          stockLevelsData[month] =
            (stockLevelsData[month] || 0) + (item.quantity || 0);
        });

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const monthlyUsage = months.map(
          (month) => monthlyUsageData[month] || 0,
        );
        const stockLevels = months.map((month) => stockLevelsData[month] || 0);

        setMonthlyUsage(monthlyUsage);
        setStockLevels(stockLevels);

        // Prepare chart data
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
          labels: months,
          datasets: [
            {
              label: "Monthly Usage",
              data: monthlyUsage,
              borderColor: documentStyle.getPropertyValue("--blue-500"),
              backgroundColor: documentStyle.getPropertyValue("--blue-100"),
              fill: false,
              tension: 0.4,
            },
            {
              label: "Stock Levels",
              data: stockLevels,
              borderColor: documentStyle.getPropertyValue("--green-500"),
              backgroundColor: documentStyle.getPropertyValue("--green-100"),
              fill: false,
              tension: 0.4,
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
                  return `${label}: ${value}`;
                },
                afterLabel: (context) => {
                  const month = context.label;
                  const usage = monthlyUsage[context.dataIndex];
                  const stock = stockLevels[context.dataIndex];
                  return [
                    `Usage: ${usage}`,
                    `Stock: ${stock}`,
                    `Utilization: ${((usage / stock) * 100 || 0).toFixed(2)}%`,
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
              },
              grid: {
                color: documentStyle.getPropertyValue("--surface-border"),
              },
              title: {
                display: true,
                text: "Quantity",
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
                text: "Month",
                color: documentStyle.getPropertyValue("--text-color"),
              },
            },
          },
        };

        setChartData(data);
        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock utilization rate:", error);
        setLoading(false);
      }
    };

    fetchStockUtilizationRate();
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
          <span className="block text-900 font-medium mb-1">
            Stock Utilization Rate
          </span>
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
            {utilizationRate.toFixed(2)}%
          </div>
          <div
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
                <strong>Stock Utilization Rate:</strong> (Total Stock Out /
                Total Stock In) × 100
              </li>
              <li>
                <strong>Total Stock In:</strong> Sum of all items added to
                stock.
              </li>
              <li>
                <strong>Total Stock Out:</strong> Sum of all items used or sold.
              </li>
            </ul>
          </div>
          <div style={{ marginTop: "20px", height: "300px" }}>
            <Chart
              type="line"
              data={chartData}
              options={chartOptions}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
