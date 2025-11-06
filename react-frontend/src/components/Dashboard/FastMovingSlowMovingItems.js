import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";
import client from "../../services/restClient";

export default function FastMovingSlowMovingItems() {
  const [fastMovingItems, setFastMovingItems] = useState([]);
  const [slowMovingItems, setSlowMovingItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchFastSlowMovingItems = async () => {
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

        // Calculate item movements
        const itemMovements = {};
        stockOutResponse.data.forEach((item) => {
          const partName = item.partName;
          const description = partNameToDescription[partName] || "Unknown Item";
          itemMovements[description] =
            (itemMovements[description] || 0) + (item.quantity || 0);
        });

        // Sort items by movement quantity
        const sortedItems = Object.keys(itemMovements).sort(
          (a, b) => itemMovements[b] - itemMovements[a],
        );

        // Get top 3 fast-moving and bottom 3 slow-moving items
        const fastMovingItems = sortedItems.slice(0, 3);
        const slowMovingItems = sortedItems.slice(-3);

        setFastMovingItems(fastMovingItems);
        setSlowMovingItems(slowMovingItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fast/slow moving items:", error);
        setLoading(false);
      }
    };

    fetchFastSlowMovingItems();
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
            Fast-Moving vs Slow-Moving Items
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
          <div>Fast-Moving: {fastMovingItems.join(", ")}</div>
          <div>Slow-Moving: {slowMovingItems.join(", ")}</div>
        </div>
      )}
    </div>
  );
}
