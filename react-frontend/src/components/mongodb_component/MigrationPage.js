import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { ScrollPanel } from "primereact/scrollpanel";
import { Toolbar } from "primereact/toolbar";

export default function MigrationPage() {
  const [bakFile, setBakFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const [databaseInfo, setDatabaseInfo] = useState(null);
  const [tableData, setTableData] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);
  const [viewRecordsDialog, setViewRecordsDialog] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const toast = useRef(null);

  // Fetch database schema after migration
  useEffect(() => {
    if (migrationResult?.success) {
      fetchDatabaseSchema();
    }
  }, [migrationResult]);

  const fetchDatabaseSchema = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_SERVER_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/database/schema`);
      
      if (!response.ok) throw new Error('Failed to fetch database schema');
      
      const result = await response.json();
      if (result.success) {
        setDatabaseInfo(result.database);
      }
    } catch (err) {
      console.error("Error fetching database schema:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load database schema",
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTableRecords = async (tableName, page = 1, filterValues = {}) => {
    try {
      setLoadingRecords(true);
      const baseUrl = process.env.REACT_APP_SERVER_URL || window.location.origin;
      
      const params = new URLSearchParams({
        table: tableName,
        page: page,
        pageSize: pageSize,
        ...filterValues
      });
      
      const response = await fetch(`${baseUrl}/database/table/records?${params}`);
      
      if (!response.ok) throw new Error('Failed to fetch table records');
      
      const result = await response.json();
      if (result.success) {
        setTableData(prev => ({
          ...prev,
          [tableName]: result
        }));
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Error fetching table records:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to load records for ${tableName}`,
        life: 3000
      });
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleViewRecords = (table) => {
    setSelectedTable(table);
    setFilters({});
    fetchTableRecords(table.tableName);
    setViewRecordsDialog(true);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    fetchTableRecords(selectedTable.tableName, 1, newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    fetchTableRecords(selectedTable.tableName, 1);
  };

  const handlePageChange = (event) => {
    const newPage = event.page + 1;
    fetchTableRecords(selectedTable.tableName, newPage, filters);
  };

  const renderTableSchema = (table) => (
    <Card key={table.tableName} className="mb-3">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="font-bold text-lg">{table.tableName}</h4>
          <div className="flex gap-3 mt-1">
            <span className="text-sm text-gray-600">
              <i className="pi pi-table mr-1"></i>
              {table.schema}
            </span>
            <span className="text-sm text-gray-600">
              <i className="pi pi-database mr-1"></i>
              {table.rowCount.toLocaleString()} rows
            </span>
            <span className="text-sm text-gray-600">
              <i className="pi pi-list mr-1"></i>
              {table.columns.length} columns
            </span>
          </div>
        </div>
        <Button 
          label="View Records" 
          icon="pi pi-eye"
          onClick={() => handleViewRecords(table)}
          className="p-button-sm"
        />
      </div>
      
      <ScrollPanel style={{ width: '100%', height: '200px' }}>
        <DataTable value={table.columns} size="small" showGridlines>
          <Column field="columnName" header="Column Name" style={{ minWidth: '150px' }} />
          <Column field="dataType" header="SQL Type" style={{ minWidth: '120px' }} />
          <Column 
            field="mongoType" 
            header="Mongo Type" 
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <Badge value={rowData.mongoType} severity="info" />
            )}
          />
          <Column 
            field="isPrimaryKey" 
            header="PK" 
            style={{ width: '70px' }}
            body={(rowData) => rowData.isPrimaryKey && <i className="pi pi-key text-yellow-600" />}
          />
          <Column 
            field="isIdentity" 
            header="Identity" 
            style={{ width: '80px' }}
            body={(rowData) => rowData.isIdentity && <i className="pi pi-sort-numeric-up text-blue-600" />}
          />
          <Column 
            field="isNullable" 
            header="Nullable" 
            style={{ width: '80px' }}
            body={(rowData) => (rowData.isNullable ? 'Yes' : 'No')}
          />
          <Column field="maxLength" header="Max Length" style={{ width: '100px' }} />
          <Column field="description" header="Description" style={{ minWidth: '200px' }} />
        </DataTable>
      </ScrollPanel>
    </Card>
  );

  const renderRecordsDialog = () => {
    if (!selectedTable || !tableData[selectedTable.tableName]) return null;
    
    const data = tableData[selectedTable.tableName];
    const totalPages = data.totalPages;
    
    return (
      <Dialog 
        header={`Records: ${selectedTable.tableName}`}
        visible={viewRecordsDialog} 
        style={{ width: '90vw', maxWidth: '1400px', height: '90vh' }}
        onHide={() => setViewRecordsDialog(false)}
        maximizable
      >
        <div className="flex flex-col h-full">
          {/* Filters */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h5 className="font-bold mb-2">Filters</h5>
            <div className="flex flex-wrap gap-2">
              {data.columns.slice(0, 5).map(col => (
                <div key={col.name} className="field">
                  <label htmlFor={col.name} className="block text-sm mb-1">
                    {col.name}
                  </label>
                  <InputText
                    id={col.name}
                    value={filters[col.name] || ''}
                    onChange={(e) => handleFilterChange(col.name, e.target.value)}
                    placeholder={`Filter ${col.name}...`}
                    className="p-inputtext-sm"
                  />
                </div>
              ))}
              <div className="flex items-end">
                <Button 
                  label="Clear" 
                  icon="pi pi-times"
                  onClick={clearFilters}
                  className="p-button-secondary p-button-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Records Table */}
          <div className="flex-grow overflow-auto">
            {loadingRecords ? (
              <div className="flex justify-center items-center h-64">
                <ProgressSpinner />
              </div>
            ) : (
              <>
                <DataTable
                  value={data.data}
                  paginator
                  rows={pageSize}
                  totalRecords={data.totalRows}
                  lazy
                  first={(currentPage - 1) * pageSize}
                  onPage={handlePageChange}
                  loading={loadingRecords}
                  scrollable
                  scrollHeight="flex"
                  className="p-datatable-sm"
                >
                  {data.columns.slice(0, 20).map(col => (
                    <Column 
                      key={col.name}
                      field={col.name}
                      header={col.name}
                      style={{ minWidth: '150px' }}
                      body={(rowData) => {
                        const value = rowData[col.name];
                        if (value === null) return <span className="text-gray-400">NULL</span>;
                        if (value === undefined) return <span className="text-gray-400">-</span>;
                        if (typeof value === 'object') return JSON.stringify(value);
                        return String(value);
                      }}
                    />
                  ))}
                </DataTable>
                
                <div className="mt-3 text-sm text-gray-600">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.totalRows)} of {data.totalRows.toLocaleString()} records
                  {Object.keys(filters).length > 0 && ' (filtered)'}
                </div>
              </>
            )}
          </div>
          
          {/* Column Summary */}
          <div className="mt-4">
            <h6 className="font-bold mb-2">Columns ({data.columns.length})</h6>
            <div className="flex flex-wrap gap-2">
              {data.columns.map(col => (
                <Badge 
                  key={col.name}
                  value={`${col.name}: ${col.type}`}
                  severity="secondary"
                  className="text-xs"
                />
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    );
  };

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
    <div className="flex flex-col items-center mt-5 p-4">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-6">SQL Server to MongoDB Migration</h2>

      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)} className="w-full max-w-6xl">
        <TabPanel header="Migration">
          {/* Existing migration UI code remains the same */}
          <div className="p-field mb-4">
            <input
              type="file"
              accept=".bak"
              onChange={handleFileChange}
              className="p-inputtext p-component w-full"
              style={{ padding: '0.5rem' }}
            />
          </div>

          <div className="flex gap-3 mb-6">
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
    
          {/* Existing migration results display remains the same */}
        </TabPanel>

        <TabPanel header="Database Schema" disabled={!databaseInfo}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ProgressSpinner />
            </div>
          ) : databaseInfo ? (
            <div>
              <Card className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{databaseInfo.databaseName}</h3>
                    <p className="text-gray-600">
                      {databaseInfo.tables.length} tables, 
                      {' '}{databaseInfo.tables.reduce((sum, t) => sum + t.rowCount, 0).toLocaleString()} total rows
                    </p>
                  </div>
                  <Button 
                    label="Refresh" 
                    icon="pi pi-refresh"
                    onClick={fetchDatabaseSchema}
                    className="p-button-outlined"
                  />
                </div>
              </Card>

              <div>
                {databaseInfo.tables.map(renderTableSchema)}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <i className="pi pi-database text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">No database schema available. Run a migration first.</p>
            </div>
          )}
        </TabPanel>
      </TabView>

      {renderRecordsDialog()}
    </div>
  );
}