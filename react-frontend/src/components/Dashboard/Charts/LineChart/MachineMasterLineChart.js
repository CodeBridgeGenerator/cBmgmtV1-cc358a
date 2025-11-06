import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";
import client from "../../../../services/restClient";

export default function MachinesByCommissionDateLineChart(props) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const { name } = props;
  const [totalMachines, setTotalMachines] = useState(0);

  useEffect(() => {
    setLoading(true);

    // Fetch machine data from the machine_master service
    const fetchMachineData = async () => {
      try {
        const response = await client.service("machineMaster").find({
          query: {
            $limit: 10000, // Set limit as needed
            $sort: { comissionDate: 1 }, // Sort by comissionDate
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching machine data:", error);
        return [];
      }
    };

    fetchMachineData()
      .then((machines) => {
        setTotalMachines(machines.length);

        // Aggregate machines by commission date
        const machinesByDate = {};
        machines.forEach((machine) => {
          const date = new Date(machine.comissionDate)
            .toISOString()
            .split("T")[0]; // Extract date in YYYY-MM-DD format
          machinesByDate[date] = (machinesByDate[date] || 0) + 1; // Increment count for the date
        });

        // Prepare chart data
        const dates = Object.keys(machinesByDate).sort();
        const machineCounts = dates.map((date) => machinesByDate[date]);

        const documentStyle = getComputedStyle(document.documentElement);
        const chartData = {
          labels: dates,
          datasets: [
            {
              label: "Machines Commissioned",
              data: machineCounts,
              fill: false,
              borderColor: documentStyle.getPropertyValue("--blue-500"), // Use a color for the line
              tension: 0.4,
            },
          ],
        };

        const options = {
          plugins: {
            legend: {
              labels: {
                color: getComputedStyle(
                  document.documentElement,
                ).getPropertyValue("--text-color"),
              },
            },
            title: {
              display: true,
              text: "Total Machines by Commission Date",
              color: getComputedStyle(
                document.documentElement,
              ).getPropertyValue("--text-color"),
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: getComputedStyle(
                  document.documentElement,
                ).getPropertyValue("--text-color-secondary"),
              },
              grid: {
                color: getComputedStyle(
                  document.documentElement,
                ).getPropertyValue("--surface-border"),
              },
            },
            y: {
              ticks: {
                color: getComputedStyle(
                  document.documentElement,
                ).getPropertyValue("--text-color-secondary"),
                callback: function (value) {
                  return Number.isInteger(value) ? value : ""; // Show only integer values
                },
              },
              grid: {
                color: getComputedStyle(
                  document.documentElement,
                ).getPropertyValue("--surface-border"),
              },
              beginAtZero: true, // Ensure Y-axis starts at zero
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        };

        setChartData(chartData);
        setChartOptions(options);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching machine data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="col-6">
      <div
        className="surface-card shadow-2 border-round p-3"
        style={{
          width: "205%",
          height: "290px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <div style={{ width: "100%", marginBottom: "10px" }}>
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
              <span className="block text-900 font-medium mb-1">{name}</span>
            </div>
          </div>
          <div
            style={{
              textAlign: "left",
              fontSize: "35px",
              fontWeight: "bold",
              color: "var(--text-color)",
              marginLeft: "0.5rem",
              padding: "0.1rem",
            }}
          >
            {totalMachines}
          </div>
        </div>
        {loading ? (
          <Skeleton width="100%" height="65%" />
        ) : (
          <Chart
            type="line"
            data={chartData}
            options={chartOptions}
            style={{ width: "100%", height: "65%", padding: "1rem" }}
          />
        )}
      </div>
    </div>
  );
}
