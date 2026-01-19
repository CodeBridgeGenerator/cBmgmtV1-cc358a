import React, { useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export default function MigrationPage() {
  const [bakFile, setBakFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const handleFileChange = (e) => {
    setBakFile(e.target.files[0]);
  };

  const handleMigrate = async () => {
    if (!bakFile) {
      toast.current.show({
        severity: "warn",
        summary: "No File Selected",
        detail: "Please select a .bak file first",
      });
      return;
    }

    setLoading(true);

    // Create FormData to send the actual file
    const formData = new FormData();
    formData.append("bakFile", bakFile);

    try {
      // Use environment variable for base URL
      const baseUrl = process.env.REACT_APP_SERVER_URL || window.location.origin;
      
      console.log(`Using server URL: ${baseUrl}`);
      console.log(`Sending request to: ${baseUrl}/migrate-bak`);
      
      // Show uploading toast
      toast.current.show({
        severity: "info",
        summary: "Uploading File",
        detail: `Uploading ${(bakFile.size / (1024 * 1024)).toFixed(2)} MB backup file...`,
        life: 3000
      });
      
      const response = await fetch(`${baseUrl}/migrate-bak`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      // Parse JSON response
      const result = await response.json();
      console.log("Success response:", result);
      
      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Migration Complete",
          detail: result.message || "Database migration completed successfully!",
          life: 5000
        });
        
        // Show detailed summary
        if (result.summary) {
          setTimeout(() => {
            toast.current.show({
              severity: "info",
              summary: "Migration Summary",
              detail: `Tables: ${result.summary.successfulTables}/${result.summary.totalTables} successful, Rows: ${result.summary.totalRowsMigrated}`,
              life: 7000
            });
          }, 1000);
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Migration Failed",
          detail: result.error || result.message || "Migration failed",
          life: 5000
        });
      }
      
    } catch (err) {
      console.error("Migration error:", err);
      toast.current.show({
        severity: "error",
        summary: "Migration Failed",
        detail: err.message || "Failed to start migration",
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center mt-10">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold mb-5">SQL Server to MongoDB Migration</h2>

      <div className="p-field mb-4">
        <input
          type="file"
          accept=".bak"
          onChange={handleFileChange}
          className="p-inputtext p-component"
          style={{ padding: '0.5rem' }}
        />
      </div>

      <div className="flex gap-3 mb-4">
        <Button
          label={loading ? "Migrating..." : "Start Migration"}
          onClick={handleMigrate}
          disabled={loading || !bakFile}
          className="p-button-raised p-button-success"
          loading={loading}
        />
        
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <i className="pi pi-spin pi-spinner mr-2"></i>
          <span>Migration in progress. This may take several minutes...</span>
        </div>
      )}
    </div>
  );
}