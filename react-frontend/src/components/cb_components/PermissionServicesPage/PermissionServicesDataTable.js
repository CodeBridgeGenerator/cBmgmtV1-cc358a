import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useRef, useEffect } from "react";
import _ from "lodash";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import moment from "moment";
import UploadService from "../../../services/UploadService";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import DownloadCSV from "../../../utils/DownloadCSV";
import InboxCreateDialogComponent from "../../cb_components/InboxPage/InboxCreateDialogComponent";
import InviteIcon from "../../../assets/media/Invite.png";
import ExportIcon from "../../../assets/media/Export & Share.png";
import CopyIcon from "../../../assets/media/Clipboard.png";
import DuplicateIcon from "../../../assets/media/Duplicate.png";
import DeleteIcon from "../../../assets/media/Trash.png";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import DeleteImage from "../../../assets/media/Delete.png";
import { connect } from "react-redux";
import client from "../../../services/restClient";
import { TabView, TabPanel } from "primereact/tabview";

const PermissionServicesDataTable = ({
  items,
  fields,
  onEditRow,
  onRowDelete,
  onRowClick,
  searchDialog,
  setSearchDialog,
  showUpload,
  setShowUpload,
  showFilter,
  setShowFilter,
  showColumns,
  setShowColumns,
  onClickSaveFilteredfields,
  selectedFilterFields,
  setSelectedFilterFields,
  selectedHideFields,
  setSelectedHideFields,
  onClickSaveHiddenfields,
  loading,
  user,
  setSelectedDelete,
  setRefresh,
  onCreateResult,
  selectedUser,
  setPaginatorRecordsNo,
  paginatorRecordsNo,
}) => {
  const dt = useRef(null);
  const urlParams = useParams();
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

  const header = (
    <div
      className="table-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h5 className="m-0"></h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Keyword Search"
        />
      </span>
    </div>
  );

  const template1 = {
    layout:
      "RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink JumpToPageInput NextPageLink LastPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 120, value: 120 },
      ];

      return (
        <React.Fragment>
          <div>
            <Dropdown
              value={paginatorRecordsNo}
              options={dropdownOptions}
              onChange={(e) => {
                options.onChange(e);
                setPaginatorRecordsNo(e.value);
              }}
            />
            <span
              className="mr-3 ml-2"
              style={{ color: "var(--text-color)", userSelect: "none" }}
            >
              items per page
            </span>
            <span style={{ width: "10px" }}></span>
          </div>
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <div className=" mr-20">
          <span style={{ color: "grey", userSelect: "none" }}>
            <span className="mr-3 ml-2">|</span>
            <span className="mr-20">
              {options.first} - {options.last} of {options.totalRecords}{" "}
              items{" "}
            </span>
          </span>
        </div>
      );
    },
    JumpToPageInput: (options) => {
      console.log("option", options);

      return (
        <div>
          <span>Page</span>
          {options.element}
          <span>of {options.props.totalPages}</span>
        </div>
      );
    },
  };

  const groupItems = (items, groupField) => {
    return _.groupBy(items, groupField);
  };

  // Common columns for all tables
  const commonColumns = [
    {
      field: "service",
      header: "Service",
      body: (rowData) => <p>{rowData.service}</p>,
    },
    {
      field: "create",
      header: "Create",
      body: (rowData) => <p>{String(rowData.create)}</p>,
    },
    {
      field: "read",
      header: "Read",
      body: (rowData) => <p>{String(rowData.read)}</p>,
    },
    {
      field: "update",
      header: "Update",
      body: (rowData) => <p>{String(rowData.update)}</p>,
    },
    {
      field: "delete",
      header: "Delete",
      body: (rowData) => <p>{String(rowData.delete)}</p>,
    },
    {
      field: "import",
      header: "Import",
      body: (rowData) => <p>{String(rowData.import)}</p>,
    },
    {
      field: "export",
      header: "Export",
      body: (rowData) => <p>{String(rowData.export)}</p>,
    },
    {
      field: "seeder",
      header: "Seeder",
      body: (rowData) => <p>{String(rowData.seeder)}</p>,
    },
  ];

  // Separate items by category
  const groupedRoleItems = groupItems(
    items.filter((item) => item.roleId),
    "roleId.name",
  );
  const groupedPositionItems = groupItems(
    items.filter((item) => item.positionId),
    "positionId.name",
  );
  const groupedProfileItems = groupItems(
    items.filter((item) => item.profile),
    "profile.name",
  );

  // Render DataTable with grouping
  const renderDataTable = (
    groupedItems,
    groupField,
    groupHeaderTemplate,
    extraColumn,
  ) => (
    <DataTable
      value={Object.values(groupedItems).flat()}
      ref={dt}
      removableSort
      onRowClick={onRowClick}
      scrollable
      rowHover
      stripedRows
      paginator
      rows={paginatorRecordsNo}
      rowsPerPageOptions={[10, 50, 250, 500]}
      size={"small"}
      paginatorTemplate={template1}
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      rowClassName="cursor-pointer"
      alwaysShowPaginator={!urlParams.singleUsersId}
      loading={loading}
      globalFilter={globalFilter}
      header={header}
      selection={selectedItems}
      onSelectionChange={(e) => setSelectedItems(e.value)}
      rowGroupMode="subheader"
      groupRowsBy={groupField}
      rowGroupHeaderTemplate={groupHeaderTemplate}
      // expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
    >
      {/* First Column: Service */}
      <Column
        field="service"
        header="Service"
        body={(rowData) => <p>{rowData.service}</p>}
        filter={selectedFilterFields.includes("service")}
        hidden={selectedHideFields?.includes("service")}
        style={{ minWidth: "8rem" }}
      />

      {/* Second Column: Role, Position, or Profile */}
      {/* <Column
        field={extraColumn.field}
        header={extraColumn.header}
        body={extraColumn.body}
        filter={selectedFilterFields.includes(extraColumn.field)}
        hidden={selectedHideFields?.includes(extraColumn.field)}
        style={{ minWidth: "8rem" }}
      /> */}

      {/* Render remaining common columns */}
      {commonColumns.slice(1).map((col, idx) => (
        <Column
          key={idx}
          field={col.field}
          header={col.header}
          body={col.body}
          filter={selectedFilterFields.includes(col.field)}
          hidden={selectedHideFields?.includes(col.field)}
          style={{ minWidth: "8rem" }}
        />
      ))}

      <Column
        header="Edit"
        body={(rowData) => (
          <Button
            onClick={() => onEditRow(rowData)}
            icon={`pi ${rowData.isEdit ? "pi-check" : "pi-pencil"}`}
            className={`p-button-rounded p-button-text ${rowData.isEdit ? "p-button-success" : "p-button-warning"}`}
          />
        )}
      />
      <Column
        header="Delete"
        body={(rowData) => (
          <Button
            onClick={() => onRowDelete(rowData._id)}
            icon="pi pi-times"
            className="p-button-rounded p-button-danger p-button-text"
          />
        )}
      />
    </DataTable>
  );

  // Header templates for grouping
  const roleHeaderTemplate = (data) => (
    <div className="flex align-items-center gap-2">
      <span className="font-bold">{data.roleId?.name}</span>
    </div>
  );

  const positionHeaderTemplate = (data) => (
    <div className="flex align-items-center gap-2">
      <span className="font-bold">{data.positionId?.name}</span>
    </div>
  );

  const profileHeaderTemplate = (data) => (
    <div className="flex align-items-center gap-2">
      <span className="font-bold">{data.profile?.name}</span>
    </div>
  );

  return (
    <>
      <TabView>
        <TabPanel header="Roles">
          {renderDataTable(
            groupedRoleItems,
            "roleId.name",
            roleHeaderTemplate,
            {
              field: "roleId.name",
              header: "Role",
              body: (rowData) => <p>{rowData.roleId?.name}</p>,
            },
          )}
        </TabPanel>
        <TabPanel header="Positions">
          {renderDataTable(
            groupedPositionItems,
            "positionId.name",
            positionHeaderTemplate,
            {
              field: "positionId.name",
              header: "Position",
              body: (rowData) => <p>{rowData.positionId?.name}</p>,
            },
          )}
        </TabPanel>
        <TabPanel header="Profiles">
          {renderDataTable(
            groupedProfileItems,
            "profile.name",
            profileHeaderTemplate,
            {
              field: "profile.name",
              header: "Profile",
              body: (rowData) => <p>{rowData.profile?.name}</p>,
            },
          )}
        </TabPanel>
      </TabView>

      {/* Dialogs for upload, search, filter, and hide columns */}
      <Dialog
        header="Upload PermissionServices Data"
        visible={showUpload}
        onHide={() => setShowUpload(false)}
      >
        <UploadService
          user={user}
          serviceName="permissionService"
          onUploadComplete={() => setShowUpload(false)}
        />
      </Dialog>

      <Dialog
        header="Search PermissionServices"
        visible={searchDialog}
        onHide={() => setSearchDialog(false)}
      >
        Search
      </Dialog>

      <Dialog
        header="Filter Users"
        visible={showFilter}
        onHide={() => setShowFilter(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedFilterFields}
            onChange={(e) => setSelectedFilterFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            onClickSaveFilteredfields(selectedFilterFields);
            setSelectedFilterFields(selectedFilterFields);
            setShowFilter(false);
          }}
        />
      </Dialog>

      <Dialog
        header="Hide Columns"
        visible={showColumns}
        onHide={() => setShowColumns(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedHideFields}
            onChange={(e) => setSelectedHideFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            onClickSaveHiddenfields(selectedHideFields);
            setSelectedHideFields(selectedHideFields);
            setShowColumns(false);
          }}
        />
      </Dialog>
    </>
  );
};

const mapState = (state) => {
  const { isLoggedIn, user } = state.auth;
  return { isLoggedIn, user };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  get: () => dispatch.cache.get(),
  set: (data) => dispatch.cache.set(data),
});

export default connect(mapState, mapDispatch)(PermissionServicesDataTable);
