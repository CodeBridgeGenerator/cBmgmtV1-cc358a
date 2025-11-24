import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";
import client from "../../services/restClient";

export default function ReorderAlerts() {
  const [reorderAlerts, setReorderAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchReorderAlerts = async () => {
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

        const stockLevels = {};
        stockInResponse.data.forEach((item) => {
          stockLevels[item.partName] =
            (stockLevels[item.partName] || 0) + (item.quantity || 0);
        });
        stockOutResponse.data.forEach((item) => {
          stockLevels[item.partName] =
            (stockLevels[item.partName] || 0) - (item.quantity || 0);
        });

        const reorderAlerts = Object.keys(stockLevels).filter(
          (partName) => stockLevels[partName] < 10,
        );

        setReorderAlerts(reorderAlerts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reorder alerts:", error);
        setLoading(false);
      }
    };

    fetchReorderAlerts();
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
            Reorder Alerts
          </span>
        </div>
      </div>
      {loading ? (
        <Skeleton width="100%" height="65px" padding="10px" />
      ) : (
        <div
          style={{
            textAlign: "left",
            fontSize: "25px",
            fontWeight: "bold",
            color: "var(--text-color)",
            marginLeft: "0.5rem",
          }}
        >
          {reorderAlerts.join(", ")}
        </div>
      )}
    </div>
  );
}
