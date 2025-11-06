import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg[key] = element.message;
      }
    }
  }
  return errMsg.length
    ? errMsg
    : errorObj.message
      ? { error: errorObj.message }
      : {};
};

const ApikeyCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);
  const urlParams = useParams();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl = process.env.REACT_APP_SERVER_URL + "/listServices";
        const response = await axios.get(apiUrl);
        if (response.data?.status && response.data?.data) {
          setServiceOptions(response.data.data);
        } else {
          console.error("Failed to fetch service options:", response.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let init = { active: false, duration: 60 * 1000, requests: 1000 };
    if (!_.isEmpty(props?.entity)) {
      init = initilization({ ...props?.entity, ...init }, [], setError);
    }
    set_entity({ ...init });
    setError({});
  }, [props.show]);

  const validate = () => {
    let ret = true;
    const error = {};

    if (_.isEmpty(_entity?.projectName)) {
      error["projectName"] = `Project Name field is required`;
      ret = false;
    }

    if (_.isEmpty(_entity?.serviceName)) {
      error["serviceName"] = `Service Name field is required`;
      ret = false;
    }

    if (!ret) setError(error);
    return ret;
  };

  const onSave = async () => {
    if (!validate()) return;
    let _data = {
      projectName: _entity?.projectName,
      requests: _entity?.requests,
      duration: _entity?.duration,
      serviceName: _entity?.serviceName,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("apikey").create(_data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Apikey created successfully",
      });
      props.onCreateResult(result);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Apikey",
      });
    }
    setLoading(false);
  };

  const renderFooter = () => (
    <div className="flex justify-content-end">
      <Button
        label="save"
        className="p-button-text no-focus-effect"
        onClick={onSave}
        loading={loading}
      />
      <Button
        label="close"
        className="p-button-text no-focus-effect p-button-secondary"
        onClick={props.onHide}
      />
    </div>
  );

  const setValByKey = (key, val) => {
    let new_entity = { ..._entity, [key]: val };
    set_entity(new_entity);
    setError({});
  };

  return (
    <Dialog
      header="Create Apikey"
      visible={props.show}
      closable={false}
      onHide={props.onHide}
      modal
      style={{ width: "40vw" }}
      className="min-w-max scalein animation-ease-in-out animation-duration-1000"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="apikey-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="projectName">Project Name:</label>
            <InputText
              id="projectName"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.projectName}
              onChange={(e) => setValByKey("projectName", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["projectName"]) ? (
              <p className="m-0" key="error-projectName">
                {error["projectName"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="serviceName">Accessiable Services:</label>
            <MultiSelect
              id="serviceName"
              className="w-full mt-2"
              value={_entity?.serviceName}
              options={serviceOptions}
              onChange={(e) => setValByKey("serviceName", e.value)}
              filter
              placeholder="Select Services"
              display="chip"
            />

          </span>
          <small className="p-error">
            {!_.isEmpty(error["serviceName"]) ? (
              <p className="m-0" key="error-serviceName">
                {error["serviceName"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="requests">Requests:</label>
            <InputNumber
              id="requests"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.requests}
              onChange={(e) => setValByKey("requests", e.value)}
              min={10}
              max={10000}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["requests"]) ? (
              <p className="m-0" key="error-requests">
                {error["requests"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="duration">Duration:</label>
            {" seconds"}
            <InputNumber
              id="duration"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.duration}
              onChange={(e) => setValByKey("duration", e.value)}
              min={100}
              max={100000}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["duration"]) ? (
              <p className="m-0" key="error-duration">
                {error["duration"]}
              </p>
            ) : null}
          </small>
        </div>
      </div>
    </Dialog>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ApikeyCreateDialogComponent);
