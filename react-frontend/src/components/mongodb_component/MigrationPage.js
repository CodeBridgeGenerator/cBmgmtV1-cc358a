import React, { useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export default function MigrationPage() {
  const [bakFile, setBakFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const toast = useRef(null);

  const handleFileChange = (e) => {
    setBakFile(e.target.files[0]);
    setMigrationResult(null); // Clear previous results
  };

  // Function to download Config.json
  const downloadConfigJson = () => {
    if (!migrationResult?.config?.data) {
      toast.current.show({
        severity: "warn",
        summary: "No Config Available",
        detail: "Configuration file is not available yet",
      });
      return;
    }

    try {
      // Create a blob from the config data
      const blob = new Blob([migrationResult.config.data], { type: 'application/json' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = migrationResult.config.fileName || 'migration-config.json';
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.current.show({
        severity: "success",
        summary: "Config Downloaded",
        detail: `Configuration file downloaded successfully!`,
        life: 3000
      });
    } catch (err) {
      console.error("Error downloading config:", err);
      toast.current.show({
        severity: "error",
        summary: "Download Failed",
        detail: "Failed to download configuration file",
      });
    }
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
    setMigrationResult(null);

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
      
      setMigrationResult(result);
      
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
        
        {migrationResult?.config?.downloadReady && (
          <Button
            label="Download Config.json"
            onClick={downloadConfigJson}
            className="p-button-raised p-button-help"
            icon="pi pi-download"
          />
        )}
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <i className="pi pi-spin pi-spinner mr-2"></i>
          <span>Migration in progress. This may take several minutes...</span>
        </div>
      )}

      {migrationResult && migrationResult.success && (
        <div className="mt-6 w-full max-w-4xl">
          <div className="p-4 bg-green-50 rounded-lg mb-4">
            <h3 className="text-lg font-bold text-green-800 mb-2">Migration Successful!</h3>
            <p className="text-green-700">{migrationResult.message}</p>
            
            {migrationResult.summary && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white rounded shadow">
                  <p className="text-sm text-gray-600">Tables</p>
                  <p className="text-2xl font-bold">
                    {migrationResult.summary.successfulTables}/{migrationResult.summary.totalTables}
                  </p>
                </div>
                <div className="p-3 bg-white rounded shadow">
                  <p className="text-sm text-gray-600">Rows Migrated</p>
                  <p className="text-2xl font-bold">{migrationResult.summary.totalRowsMigrated.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white rounded shadow">
                  <p className="text-sm text-gray-600">Fields Analyzed</p>
                  <p className="text-2xl font-bold">{migrationResult.summary.totalFieldsAnalyzed}</p>
                </div>
                <div className="p-3 bg-white rounded shadow">
                  <p className="text-sm text-gray-600">MongoDB Database</p>
                  <p className="text-lg font-bold">{migrationResult.summary.mongoDatabase}</p>
                </div>
              </div>
            )}
            
            {migrationResult.config && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <h4 className="font-bold text-blue-800 mb-2">Configuration File Ready</h4>
                <p className="text-blue-700 mb-3">
                  A Config.json file with {migrationResult.config.services} services has been generated.
                  Click "Download Config.json" to get the configuration file for your code generator.
                </p>
                <Button
                  label="Download Config.json"
                  onClick={downloadConfigJson}
                  className="p-button-raised p-button-help"
                  icon="pi pi-download"
                />
              </div>
            )}
          </div>
          
          {/* Table Details */}
          {migrationResult.details && migrationResult.details.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-bold mb-3">Table Migration Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left">Table Name</th>
                      <th className="border border-gray-300 p-2 text-left">Status</th>
                      <th className="border border-gray-300 p-2 text-left">Rows Migrated</th>
                      <th className="border border-gray-300 p-2 text-left">MongoDB Collection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {migrationResult.details.map((table, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-2">{table.table}</td>
                        <td className="border border-gray-300 p-2">
                          {table.success ? (
                            <span className="text-green-600 font-semibold">✓ Success</span>
                          ) : (
                            <span className="text-red-600 font-semibold">✗ Failed</span>
                          )}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {table.rowsMigrated?.toLocaleString() || '0'}
                        </td>
                        <td className="border border-gray-300 p-2">{table.mongoCollection}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}