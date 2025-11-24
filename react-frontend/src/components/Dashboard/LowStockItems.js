import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";
import client from "../../services/restClient";

export default function LowStockItems() {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchLowStockItems = async () => {
      try {
        // Fetch parts_master data
        const partsMasterResponse = await client.service("partsMaster").find({
          query: {
            $limit: 10000,
          },
        });

        // Identify low stock items
        const lowStockItems = partsMasterResponse.data
          .filter((part) => part.quantity <= part.reOrderingPoint)
          .map((part) => part.description);

        setLowStockItems(lowStockItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching low stock items:", error);
        setLoading(false);
      }
    };

    fetchLowStockItems();
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
            Low Stock Items
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
            {lowStockItems.join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}
