/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import _ from "lodash";

const ProjectsPage = (props) => {
  const [data, setData] = useState([]);
  const [responseData, setResponseData] = useState({});
  const [responseDataData, setResponseDataData] = useState({});
  const [columns, setColumns] = useState([]);
  const [responseDataErrorState, setResponseDataErrorState] = useState(false);

  useEffect(() => {
    getGroupsViaApi();
  }, []);

  const getGroupsViaService = async () => {
    // api connections
    const response = await axios.get("http://localhost:3030/mongodb/groups");
    // console.log("getGroups",response.data.data.results);
    const c = Object.keys(response.data.data.results[0]).filter(
      (i) => i !== "links"
    );
    // console.log(c);
    setColumns(c);
    setData(response.data.data.results);
  };

  const getGroupsViaApi = async () => {
    // api connections
    const response = await axios.get("http://localhost:3030/mongodb/groups");
    console.log("response", response);
    console.log("data", response.data);
    console.log("datadata", response.data.data);
    console.log("results", response.data.data.results);
    if (response.data.data.results) {
      const c = Object.keys(response?.data?.data?.results[0]).filter(
        (i) => i !== "links"
      );
      // console.log(c);
      setColumns(c);
      setData(response.data.data.results);
    } else {
      if (response.data) {
        responseDataError(response.data);
        setResponseData(response.data);
      }
      if (response.data.data) {
        setResponseDataData(response.data.data);
      }
    }
  };

  const responseDataError = () => {
    setResponseDataErrorState(true);
  };

  const displayResponseError = () => {
    const keys = Object.keys(responseDataData);

    return (
      keys &&
      keys.map((e,i) => (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">
                {_.startCase(e)}
              </div>
              <div className="flex-1 text-surface-900 dark:text-surface-0 text-base leading-tight">
                {responseDataData[e]}
              </div>
            </div>
            {/* <div className="flex justify-end"> */}
              {/* <button pButton [rounded]="true" [outlined]="true" severity="secondary" className="shrink-0">
                                <i pButtonIcon className="pi pi-pen-to-square"></i>
                            </button> */}
            {/* </div> */}
          </div>

          {keys.length !== i + 1 && <div className="border-t border-surface-200 dark:border-surface-700"></div>}
        </>
      ))
    );
  };

  return (
    <div>
      <Card title="Projects"></Card>
      <DataTable value={data}>
        {columns.map((col, i) => (
          <Column key={i} field={col} header={col} />
        ))}
      </DataTable>
      <Dialog
        header="Response Error"
        visible={responseDataErrorState}
        modal={true}
        draggable={true}
        showCloseIcon={true}
        closeOnEscape={true}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!responseDataErrorState) return;
          setResponseDataErrorState(false);
        }}
      >
        <div className="bg-surface-50 dark:bg-surface-950 px-8 md:px-12 py-12 md:py-12 lg:px-80">
          <div className="bg-surface-0 dark:bg-surface-900 p-2 shadow rounded-2xl flex flex-col gap-2">
            <div className="flex flex-col gap-2 pb-1">
              <div className="font-semibold text-xl text-surface-900 dark:text-surface-0 leading-tight">
                Details
              </div>
              <div className="text-surface-500 dark:text-surface-300 text-base leading-tight">
                {responseData.detail}
              </div>
            </div>

            {displayResponseError()}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  const { cache } = state.cache;
  return { user, isLoggedIn, cache };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  getSchema: (serviceName) => dispatch.db.getSchema(serviceName),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
  get: () => dispatch.cache.get(),
  set: (data) => dispatch.cache.set(data),
});

export default connect(mapState, mapDispatch)(ProjectsPage);
