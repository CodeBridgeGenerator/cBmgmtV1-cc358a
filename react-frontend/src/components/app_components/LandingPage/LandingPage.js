/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

const LandingPage = (props) => {
  const uuid = localStorage.getItem("uuid");
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({});
  const [columns, setColumns] = useState([]);
  const [emailToInvite, setEmailToInvite] = useState("info@cloudbasha.com");

  useEffect(() => {
    if (!uuid) {
      props.setUUID();
    }
  }, []);

  const fetchData = () => {
    props.getData({ service: "roles", query: {} }).then((data) => {
      if (!_.isEmpty(data.data)) {
        setData(data.data);
        setColumns(
          Object.keys(data.data[0]).map((r) => {
            return { field: r, header: r };
          })
        );
      } else {
        setData([]);
        setColumns([]);
      }
    });
  };

  const saveData = () => {
    const positions = "66e678d947480b243fc573fb";
    const roles = "67435a2c6521f76d8ac46f30";
    const code = 991990;

    console.log("emailToInvite", emailToInvite);
    if (emailToInvite) {
      props
        .setData("userInvites", { emailToInvite, positions, roles, code })
        .then((data) => {
          if (!_.isEmpty(data.data)) {
            console.log(data.data);
            setStatus(data.data);
          }
          alert("no data");
        })
        .catch(console.log);
    } else {
      alert("emailToInvite", " not foudn");
    }
  };

  return (
    <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-column lg:flex-row justify-content-center align-items-center gap-7">
        <div className="text-center lg:text-right">
          <div className="mt-6 mb-3 font-bold text-6xl text-900">
            User saved id {props.webUserId}
            <br />
            User uuid {uuid}
          </div>
          <p className="text-700 text-3xl mt-0 mb-6">
            Fetch Data from users.
            <Button round onClick={fetchData} label="get Data" />
          </p>
          <DataTable value={data} tableStyle={{ minWidth: "50rem" }}>
            {columns.map((col, i) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </div>
      </div>
      <div>
        <div className="surface-ground px-4 py-8 md:px-6 lg:px-8">
          <div className="text-900 font-medium text-900 text-xl mb-3">
            User Invite
          </div>
          <div className="surface-card p-4 shadow-2 border-round">
            <div className="grid formgrid p-fluid">
              <div className="field mb-4 col-12 md:col-6">
                <label htmlFor="emailToInvite" className="font-medium text-900">
                  Email
                </label>
                <InputText
                  id="emailToInvite"
                  onClick={(e) => setEmailToInvite(e.target.value)}
                  type="text"
                />
              </div>

              <div className="col-12">
                <div className="field mb-4 col-12 md:col-6">
                  <label htmlFor="positions" className="font-medium text-900">
                    Position
                  </label>
                  <InputText
                    id="positions"
                    value="External"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="field mb-4 col-12 md:col-6">
                  <label htmlFor="roles" className="font-medium text-900">
                    Role
                  </label>
                  <InputText
                    id="roles"
                    value="External"
                    type="text"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="col-12">
                <Button
                  label="Save Changes"
                  onClick={saveData}
                  className="w-auto mt-3"
                />
                <span>{`${status?.message} ${String(status?.status)}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  const { webUserId } = state.apiKey;
  return { user, isLoggedIn, webUserId };
};

const mapDispatch = (dispatch) => ({
  setUUID: () => dispatch.apiKey.setUUID(),
  getData: (body) => dispatch.apiKey.getData(body),
  setData: (service, data, id = null, method = "post") =>
    dispatch.apiKey.setData({ service, data, id, method }),
});

export default connect(mapState, mapDispatch)(LandingPage);
