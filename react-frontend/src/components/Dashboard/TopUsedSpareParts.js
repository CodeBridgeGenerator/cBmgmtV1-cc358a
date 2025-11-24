import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";
import client from "../../services/restClient";

export default function TopUsedSpareParts() {
  const [topUsedSpareParts, setTopUsedSpareParts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchTopUsedSpareParts = async () => {
      try {
        // Fetch stockOutDetails data
        const stockOutResponse = await client.service("stockOutDetails").find({
          query: {
            $limit: 10000,
          },
        });

        // Fetch parts_master data to map partName (ObjectId) to description
        const partsMasterResponse = await client.service("partsMaster").find({
          query: {
            $limit: 10000,
          },
        });

        // Create a mapping of partName (ObjectId) to description
        const partNameToDescription = {};
        partsMasterResponse.data.forEach((part) => {
          partNameToDescription[part._id] = part.description;
        });

        // Calculate item usage
        const itemUsage = {};
        stockOutResponse.data.forEach((item) => {
          const partName = item.partName;
          const description = partNameToDescription[partName] || "Unknown Item";
          itemUsage[description] =
            (itemUsage[description] || 0) + (item.quantity || 0);
        });

        // Sort items by usage quantity
        const sortedItems = Object.keys(itemUsage).sort(
          (a, b) => itemUsage[b] - itemUsage[a],
        );

        // Get top 3 used spare parts
        const topUsedSpareParts = sortedItems.slice(0, 3);

        setTopUsedSpareParts(topUsedSpareParts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top used spare parts:", error);
        setLoading(false);
      }
    };

    fetchTopUsedSpareParts();
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
            Top Used Spare Parts
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
          {topUsedSpareParts.join(", ")}
        </div>
      )}
    </div>
  );
}
